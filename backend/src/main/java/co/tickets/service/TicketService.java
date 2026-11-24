package co.tickets.service;

import co.tickets.domain.Ticket;
import co.tickets.domain.embedded.HistorialEstado;
import co.tickets.domain.embedded.RespuestaTicket;
import co.tickets.domain.embedded.SolucionTicket;
import co.tickets.domain.enums.EstadoTicket;
import co.tickets.domain.enums.ModuloErp;
import co.tickets.domain.enums.PrioridadTicket;
import co.tickets.dto.ticket.*;
import co.tickets.exception.BusinessException;
import co.tickets.exception.NotFoundException;
import co.tickets.exception.UnauthorizedException;
import co.tickets.repository.TicketRepository;
import co.tickets.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketCounterService counterService;
    private final MongoTemplate mongoTemplate;

    public TicketService(TicketRepository ticketRepository,
                         TicketCounterService counterService,
                         MongoTemplate mongoTemplate) {
        this.ticketRepository = ticketRepository;
        this.counterService = counterService;
        this.mongoTemplate = mongoTemplate;
    }

    public TicketResponse create(CreateTicketRequest req, CustomUserDetails current) {
        String clienteId = resolveClienteId(req.clienteId(), current);

        String codigo = counterService.nextCodigo(clienteId);
        Instant now = Instant.now();

        HistorialEstado inicial = HistorialEstado.builder()
                .estadoAnterior(null)
                .estadoNuevo(EstadoTicket.nuevo.name())
                .usuarioId(current.getUsuarioId())
                .fecha(now)
                .build();

        Ticket t = Ticket.builder()
                .codigo(codigo)
                .titulo(req.titulo())
                .descripcion(req.descripcion())
                .tipo(req.tipo())
                .clienteId(clienteId)
                .usuarioId(current.getUsuarioId())
                .modulo(req.modulo())
                .prioridad(req.prioridad() != null ? req.prioridad() : PrioridadTicket.media)
                .estado(EstadoTicket.nuevo)
                .detallesEspecificos(req.detallesEspecificos() != null ? req.detallesEspecificos() : new LinkedHashMap<>())
                .respuestas(new ArrayList<>())
                .historialEstados(new ArrayList<>(List.of(inicial)))
                .build();

        return TicketResponse.from(ticketRepository.save(t));
    }

    public Page<TicketResponse> list(FilterParams f, Pageable pageable, CustomUserDetails current) {
        Query query = new Query().with(pageable);

        if (isClienteOnly(current)) {
            if (current.getUsuario().getClienteId() == null) {
                return new PageImpl<>(List.of(), pageable, 0);
            }
            query.addCriteria(Criteria.where("clienteId").is(new org.bson.types.ObjectId(current.getUsuario().getClienteId())));
        } else if (f.clienteId != null && !f.clienteId.isBlank()) {
            query.addCriteria(Criteria.where("clienteId").is(new org.bson.types.ObjectId(f.clienteId)));
        }

        if (f.modulo != null)    query.addCriteria(Criteria.where("modulo").is(f.modulo.name()));
        if (f.estado != null)    query.addCriteria(Criteria.where("estado").is(f.estado.name()));
        if (f.prioridad != null) query.addCriteria(Criteria.where("prioridad").is(f.prioridad.name()));
        if (f.tipo != null)      query.addCriteria(Criteria.where("tipo").is(f.tipo.name()));
        if (f.empleadoAsignadoId != null && !f.empleadoAsignadoId.isBlank())
            query.addCriteria(Criteria.where("empleadoAsignadoId").is(new org.bson.types.ObjectId(f.empleadoAsignadoId)));
        if (f.codigo != null && !f.codigo.isBlank())
            query.addCriteria(Criteria.where("codigo").regex(".*" + java.util.regex.Pattern.quote(f.codigo) + ".*", "i"));
        if (f.titulo != null && !f.titulo.isBlank())
            query.addCriteria(Criteria.where("titulo").regex(".*" + java.util.regex.Pattern.quote(f.titulo) + ".*", "i"));
        if (f.fechaDesde != null)
            query.addCriteria(Criteria.where("fechaCreacion").gte(f.fechaDesde));
        if (f.fechaHasta != null)
            query.addCriteria(Criteria.where("fechaCreacion").lte(f.fechaHasta));

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Ticket.class);
        List<Ticket> items = mongoTemplate.find(query, Ticket.class);
        List<TicketResponse> dtos = items.stream().map(TicketResponse::summary).toList();
        return new PageImpl<>(dtos, pageable, total);
    }

    public TicketResponse getById(String id, CustomUserDetails current) {
        Ticket t = findOrThrow(id);
        enforceClienteOwnership(t, current);
        return TicketResponse.from(t);
    }

    public TicketResponse update(String id, UpdateTicketRequest req, CustomUserDetails current) {
        Ticket t = findOrThrow(id);
        enforceClienteOwnership(t, current);

        if (t.getEstado() == EstadoTicket.cerrado) {
            throw new BusinessException("No se puede modificar un ticket cerrado");
        }

        t.setTitulo(req.titulo());
        t.setDescripcion(req.descripcion());
        if (req.prioridad() != null) t.setPrioridad(req.prioridad());
        if (req.detallesEspecificos() != null) t.setDetallesEspecificos(req.detallesEspecificos());

        return TicketResponse.from(ticketRepository.save(t));
    }

    public TicketResponse asignar(String id, String empleadoId, CustomUserDetails current) {
        Ticket t = findOrThrow(id);
        t.setEmpleadoAsignadoId(empleadoId);
        return TicketResponse.from(ticketRepository.save(t));
    }

    public TicketResponse cambiarEstado(String id, EstadoTicket nuevo, CustomUserDetails current) {
        Ticket t = findOrThrow(id);
        EstadoTicket actual = t.getEstado();

        if (actual == nuevo) {
            throw new BusinessException("El ticket ya está en estado " + nuevo);
        }
        if (!actual.canTransitionTo(nuevo)) {
            throw new BusinessException("Transición no permitida: %s → %s".formatted(actual, nuevo));
        }

        Instant now = Instant.now();
        t.setEstado(nuevo);
        t.getHistorialEstados().add(HistorialEstado.builder()
                .estadoAnterior(actual.name())
                .estadoNuevo(nuevo.name())
                .usuarioId(current.getUsuarioId())
                .fecha(now)
                .build());

        if (nuevo == EstadoTicket.cerrado || nuevo == EstadoTicket.resuelto) {
            if (t.getFechaCierre() == null) t.setFechaCierre(now);
        } else {
            t.setFechaCierre(null);
        }

        return TicketResponse.from(ticketRepository.save(t));
    }

    public TicketResponse crearRespuesta(String id, CrearRespuestaRequest req, CustomUserDetails current) {
        Ticket t = findOrThrow(id);
        enforceClienteOwnership(t, current);

        boolean esInterno = Boolean.TRUE.equals(req.esInterno());

        if (esInterno && isClienteOnly(current)) {
            throw new UnauthorizedException("Clientes no pueden crear notas internas");
        }

        t.getRespuestas().add(RespuestaTicket.builder()
                .usuarioId(current.getUsuarioId())
                .mensaje(req.mensaje())
                .fecha(Instant.now())
                .esInterno(esInterno)
                .build());

        return TicketResponse.from(ticketRepository.save(t));
    }

    public TicketResponse registrarSolucion(String id, RegistrarSolucionRequest req, CustomUserDetails current) {
        Ticket t = findOrThrow(id);
        if (t.getEstado() == EstadoTicket.cerrado) {
            throw new BusinessException("No se puede modificar un ticket cerrado");
        }
        t.setSolucion(SolucionTicket.builder()
                .descripcion(req.descripcion())
                .documentadoPor(current.getUsuarioId())
                .fecha(Instant.now())
                .build());
        return TicketResponse.from(ticketRepository.save(t));
    }

    public void delete(String id) {
        Ticket t = findOrThrow(id);
        ticketRepository.delete(t);
    }

    // ---- helpers ----

    private Ticket findOrThrow(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket", id));
    }

    private String resolveClienteId(String requestClienteId, CustomUserDetails current) {
        String own = current.getUsuario().getClienteId();
        if (isClienteOnly(current)) {
            if (own == null) {
                throw new BusinessException("Usuario cliente sin clienteId asociado");
            }
            return own;
        }
        if (requestClienteId == null || requestClienteId.isBlank()) {
            if (own != null) return own;
            throw new BusinessException("Debe especificar clienteId");
        }
        return requestClienteId;
    }

    private void enforceClienteOwnership(Ticket t, CustomUserDetails current) {
        if (isClienteOnly(current)) {
            String own = current.getUsuario().getClienteId();
            if (own == null || !own.equals(t.getClienteId())) {
                throw new UnauthorizedException("No tiene acceso a este ticket");
            }
        }
    }

    private boolean isClienteOnly(CustomUserDetails current) {
        boolean hasFullAccess = current.getPermisos().contains("*")
                || current.getPermisos().contains("tickets.leer");
        return !hasFullAccess;
    }

    public static class FilterParams {
        public String codigo;
        public String titulo;
        public String clienteId;
        public ModuloErp modulo;
        public EstadoTicket estado;
        public PrioridadTicket prioridad;
        public co.tickets.domain.enums.TipoTicket tipo;
        public String empleadoAsignadoId;
        public Instant fechaDesde;
        public Instant fechaHasta;
    }
}
