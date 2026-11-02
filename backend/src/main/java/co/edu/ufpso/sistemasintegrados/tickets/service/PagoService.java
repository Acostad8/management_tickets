package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Cliente;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Membresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Pago;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoMembresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoPago;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.MedioPago;
import co.edu.ufpso.sistemasintegrados.tickets.dto.pago.CreatePagoRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.pago.PagoResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.pago.UpdatePagoRequest;
import co.edu.ufpso.sistemasintegrados.tickets.exception.BusinessException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.NotFoundException;
import co.edu.ufpso.sistemasintegrados.tickets.repository.ClienteRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.MembresiaRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.PagoRepository;
import co.edu.ufpso.sistemasintegrados.tickets.security.CustomUserDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PagoService {

    private static final Logger log = LoggerFactory.getLogger(PagoService.class);

    private final PagoRepository pagoRepository;
    private final ClienteRepository clienteRepository;
    private final MembresiaRepository membresiaRepository;
    private final MongoTemplate mongoTemplate;

    public PagoService(PagoRepository pagoRepository,
                       ClienteRepository clienteRepository,
                       MembresiaRepository membresiaRepository,
                       MongoTemplate mongoTemplate) {
        this.pagoRepository = pagoRepository;
        this.clienteRepository = clienteRepository;
        this.membresiaRepository = membresiaRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Transactional
    public PagoResponse registrarPago(CreatePagoRequest req) {
        Cliente cliente = clienteRepository.findById(req.clienteId())
                .orElseThrow(() -> new NotFoundException("Cliente", req.clienteId()));

        Membresia membresia = null;
        if (req.membresiaId() != null && !req.membresiaId().isBlank()) {
            membresia = membresiaRepository.findById(req.membresiaId())
                    .orElseThrow(() -> new NotFoundException("Membresia", req.membresiaId()));
            if (!membresia.getClienteId().equals(req.clienteId())) {
                throw new BusinessException("La membresía no pertenece al cliente indicado");
            }
        }

        Pago pago = Pago.builder()
                .clienteId(req.clienteId())
                .membresiaId(req.membresiaId())
                .valor(req.valor())
                .fechaPago(req.fechaPago())
                .medioPago(req.medioPago())
                .referencia(req.referencia())
                .observaciones(req.observaciones())
                .estado(EstadoPago.registrado)
                .registradoPor(currentUserId())
                .build();
        Pago saved = pagoRepository.save(pago);
        log.info("Pago registrado id={} cliente={} valor={}", saved.getId(), req.clienteId(), req.valor());

        if (membresia != null) {
            membresia.setPagoAlDia(true);
            if (membresia.getEstado() == EstadoMembresia.suspendida || membresia.getEstado() == EstadoMembresia.vencida) {
                membresia.setEstado(EstadoMembresia.activa);
            }
            membresiaRepository.save(membresia);
            log.info("Membresía {} reactivada por pago {}", membresia.getId(), saved.getId());
        }

        return PagoResponse.from(saved, cliente.getRazonSocial(),
                membresia != null ? membresia.getPlan() : null);
    }

    public Page<PagoResponse> list(String clienteId, String membresiaId, MedioPago medioPago,
                                   EstadoPago estado, LocalDate desde, LocalDate hasta, Pageable pageable) {
        Query query = new Query().with(pageable);
        if (clienteId != null && !clienteId.isBlank()) {
            query.addCriteria(Criteria.where("clienteId").is(new org.bson.types.ObjectId(clienteId)));
        }
        if (membresiaId != null && !membresiaId.isBlank()) {
            query.addCriteria(Criteria.where("membresiaId").is(new org.bson.types.ObjectId(membresiaId)));
        }
        if (medioPago != null) {
            query.addCriteria(Criteria.where("medioPago").is(medioPago.name()));
        }
        if (estado != null) {
            query.addCriteria(Criteria.where("estado").is(estado.name()));
        }
        if (desde != null || hasta != null) {
            Criteria rango = Criteria.where("fechaPago");
            if (desde != null) rango = rango.gte(desde);
            if (hasta != null) rango = rango.lte(hasta);
            query.addCriteria(rango);
        }

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Pago.class);
        List<Pago> content = mongoTemplate.find(query, Pago.class);
        Map<String, String> clientes = loadClienteNames(content);
        Map<String, String> membresias = loadMembresiaPlanes(content);
        List<PagoResponse> dtos = content.stream()
                .map(p -> PagoResponse.from(p,
                        clientes.get(p.getClienteId()),
                        p.getMembresiaId() != null ? membresias.get(p.getMembresiaId()) : null))
                .toList();
        return new PageImpl<>(dtos, pageable, total);
    }

    public PagoResponse getById(String id) {
        Pago p = findOrThrow(id);
        String razon = clienteRepository.findById(p.getClienteId()).map(Cliente::getRazonSocial).orElse(null);
        String plan = p.getMembresiaId() != null
                ? membresiaRepository.findById(p.getMembresiaId()).map(Membresia::getPlan).orElse(null)
                : null;
        return PagoResponse.from(p, razon, plan);
    }

    public List<PagoResponse> getByCliente(String clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new NotFoundException("Cliente", clienteId));
        List<Pago> pagos = pagoRepository.findByClienteIdOrderByFechaPagoDesc(clienteId);
        Map<String, String> planes = loadMembresiaPlanes(pagos);
        return pagos.stream()
                .map(p -> PagoResponse.from(p, cliente.getRazonSocial(),
                        p.getMembresiaId() != null ? planes.get(p.getMembresiaId()) : null))
                .toList();
    }

    public PagoResponse update(String id, UpdatePagoRequest req) {
        Pago p = findOrThrow(id);
        if (p.getEstado() == EstadoPago.anulado) {
            throw new BusinessException("No se puede modificar un pago anulado");
        }
        p.setValor(req.valor());
        p.setFechaPago(req.fechaPago());
        p.setMedioPago(req.medioPago());
        p.setReferencia(req.referencia());
        p.setObservaciones(req.observaciones());
        Pago saved = pagoRepository.save(p);
        String razon = clienteRepository.findById(saved.getClienteId()).map(Cliente::getRazonSocial).orElse(null);
        String plan = saved.getMembresiaId() != null
                ? membresiaRepository.findById(saved.getMembresiaId()).map(Membresia::getPlan).orElse(null)
                : null;
        return PagoResponse.from(saved, razon, plan);
    }

    @Transactional
    public PagoResponse anular(String id, String motivo) {
        Pago p = findOrThrow(id);
        if (p.getEstado() == EstadoPago.anulado) {
            throw new BusinessException("El pago ya está anulado");
        }
        p.setEstado(EstadoPago.anulado);
        p.setObservaciones(appendMotivo(p.getObservaciones(), motivo));
        Pago saved = pagoRepository.save(p);
        log.info("Pago {} anulado motivo={}", saved.getId(), motivo);

        if (saved.getMembresiaId() != null) {
            Membresia m = membresiaRepository.findById(saved.getMembresiaId()).orElse(null);
            if (m != null && Boolean.TRUE.equals(m.getPagoAlDia())) {
                m.setPagoAlDia(false);
                membresiaRepository.save(m);
                log.info("Membresía {} marcada como pagoAlDia=false por anulación de pago", m.getId());
            }
        }
        return getById(saved.getId());
    }

    public void delete(String id) {
        Pago p = findOrThrow(id);
        if (p.getEstado() == EstadoPago.registrado) {
            throw new BusinessException("Un pago registrado no puede eliminarse. Anúlalo primero.");
        }
        pagoRepository.delete(p);
    }

    private Pago findOrThrow(String id) {
        return pagoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pago", id));
    }

    private String appendMotivo(String prev, String motivo) {
        String tag = "[ANULADO: " + motivo + "]";
        if (prev == null || prev.isBlank()) return tag;
        return prev + " " + tag;
    }

    private String currentUserId() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof CustomUserDetails cud) return cud.getUsuarioId();
        } catch (Exception ignored) { }
        return null;
    }

    private Map<String, String> loadClienteNames(List<Pago> pagos) {
        Set<String> ids = pagos.stream().map(Pago::getClienteId).collect(Collectors.toSet());
        Map<String, String> result = new HashMap<>();
        clienteRepository.findAllById(ids).forEach(c -> result.put(c.getId(), c.getRazonSocial()));
        return result;
    }

    private Map<String, String> loadMembresiaPlanes(List<Pago> pagos) {
        Set<String> ids = pagos.stream()
                .map(Pago::getMembresiaId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());
        Map<String, String> result = new HashMap<>();
        if (ids.isEmpty()) return result;
        membresiaRepository.findAllById(ids).forEach(m -> result.put(m.getId(), m.getPlan()));
        return result;
    }
}
