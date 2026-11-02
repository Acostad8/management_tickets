package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Cliente;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Membresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoMembresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
import co.edu.ufpso.sistemasintegrados.tickets.dto.membresia.CreateMembresiaRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.membresia.MembresiaResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.membresia.UpdateMembresiaRequest;
import co.edu.ufpso.sistemasintegrados.tickets.exception.BusinessException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.NotFoundException;
import co.edu.ufpso.sistemasintegrados.tickets.repository.ClienteRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.MembresiaRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.PagoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MembresiaService {

    private final MembresiaRepository membresiaRepository;
    private final ClienteRepository clienteRepository;
    private final PagoRepository pagoRepository;
    private final MongoTemplate mongoTemplate;

    public MembresiaService(MembresiaRepository membresiaRepository,
                            ClienteRepository clienteRepository,
                            PagoRepository pagoRepository,
                            MongoTemplate mongoTemplate) {
        this.membresiaRepository = membresiaRepository;
        this.clienteRepository = clienteRepository;
        this.pagoRepository = pagoRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public MembresiaResponse create(CreateMembresiaRequest req) {
        Cliente cliente = clienteRepository.findById(req.clienteId())
                .orElseThrow(() -> new NotFoundException("Cliente", req.clienteId()));

        if (req.fechaVencimiento().isBefore(req.fechaInicio())) {
            throw new BusinessException("La fecha de vencimiento no puede ser anterior al inicio");
        }

        Membresia m = Membresia.builder()
                .clienteId(req.clienteId())
                .plan(req.plan())
                .modulosContratados(req.modulosContratados())
                .estado(EstadoMembresia.activa)
                .fechaInicio(req.fechaInicio())
                .fechaVencimiento(req.fechaVencimiento())
                .precio(req.precio())
                .pagoAlDia(false)
                .build();
        Membresia saved = membresiaRepository.save(m);
        return MembresiaResponse.from(saved, cliente.getRazonSocial());
    }

    public Page<MembresiaResponse> list(String clienteId, EstadoMembresia estado,
                                        ModuloErp modulo, String plan, Pageable pageable) {
        Query query = new Query().with(pageable);
        if (clienteId != null && !clienteId.isBlank()) {
            query.addCriteria(Criteria.where("clienteId").is(new org.bson.types.ObjectId(clienteId)));
        }
        if (estado != null) {
            query.addCriteria(Criteria.where("estado").is(estado.name()));
        }
        if (modulo != null) {
            query.addCriteria(Criteria.where("modulosContratados").is(modulo.name()));
        }
        if (plan != null && !plan.isBlank()) {
            query.addCriteria(Criteria.where("plan").regex(".*" + java.util.regex.Pattern.quote(plan) + ".*", "i"));
        }

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Membresia.class);
        List<Membresia> content = mongoTemplate.find(query, Membresia.class);
        Map<String, String> clienteNames = loadClienteNames(content);
        List<MembresiaResponse> dtos = content.stream()
                .map(m -> MembresiaResponse.from(m, clienteNames.get(m.getClienteId())))
                .toList();
        return new PageImpl<>(dtos, pageable, total);
    }

    public MembresiaResponse getById(String id) {
        Membresia m = findOrThrow(id);
        String razon = clienteRepository.findById(m.getClienteId()).map(Cliente::getRazonSocial).orElse(null);
        return MembresiaResponse.from(m, razon);
    }

    public List<MembresiaResponse> getByCliente(String clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new NotFoundException("Cliente", clienteId));
        return membresiaRepository.findByClienteId(clienteId).stream()
                .map(m -> MembresiaResponse.from(m, cliente.getRazonSocial()))
                .toList();
    }

    public MembresiaResponse update(String id, UpdateMembresiaRequest req) {
        Membresia m = findOrThrow(id);
        if (req.fechaVencimiento().isBefore(req.fechaInicio())) {
            throw new BusinessException("La fecha de vencimiento no puede ser anterior al inicio");
        }
        m.setPlan(req.plan());
        m.setModulosContratados(req.modulosContratados());
        m.setFechaInicio(req.fechaInicio());
        m.setFechaVencimiento(req.fechaVencimiento());
        m.setPrecio(req.precio());
        Membresia saved = membresiaRepository.save(m);
        String razon = clienteRepository.findById(saved.getClienteId()).map(Cliente::getRazonSocial).orElse(null);
        return MembresiaResponse.from(saved, razon);
    }

    public void delete(String id) {
        Membresia m = findOrThrow(id);
        long pagos = pagoRepository.findByMembresiaIdOrderByFechaPagoDesc(id).size();
        if (pagos > 0) {
            throw new BusinessException("No se puede eliminar: la membresía tiene " + pagos
                    + " pago(s) asociados. Cancelá la membresía en lugar de eliminarla para preservar la trazabilidad.");
        }
        if (m.getEstado() == EstadoMembresia.activa) {
            throw new BusinessException("No se puede eliminar una membresía activa. Cambialá a cancelada primero.");
        }
        membresiaRepository.delete(m);
    }

    public MembresiaResponse changeEstado(String id, EstadoMembresia nuevo) {
        Membresia m = findOrThrow(id);
        m.setEstado(nuevo);
        Membresia saved = membresiaRepository.save(m);
        String razon = clienteRepository.findById(saved.getClienteId()).map(Cliente::getRazonSocial).orElse(null);
        return MembresiaResponse.from(saved, razon);
    }

    private Membresia findOrThrow(String id) {
        return membresiaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Membresia", id));
    }

    private Map<String, String> loadClienteNames(List<Membresia> membresias) {
        Set<String> ids = membresias.stream().map(Membresia::getClienteId).collect(Collectors.toSet());
        Map<String, String> result = new HashMap<>();
        clienteRepository.findAllById(ids).forEach(c -> result.put(c.getId(), c.getRazonSocial()));
        return result;
    }
}
