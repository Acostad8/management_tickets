package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Capacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Empleado;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModalidadCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
import co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion.CapacitacionResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion.CreateCapacitacionRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion.UpdateCapacitacionRequest;
import co.edu.ufpso.sistemasintegrados.tickets.exception.BusinessException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.NotFoundException;
import co.edu.ufpso.sistemasintegrados.tickets.repository.AsistenciaRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.CapacitacionRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.ClienteRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.EmpleadoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class CapacitacionService {

    private final CapacitacionRepository capacitacionRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ClienteRepository clienteRepository;
    private final MongoTemplate mongoTemplate;

    public CapacitacionService(CapacitacionRepository capacitacionRepository,
                               AsistenciaRepository asistenciaRepository,
                               EmpleadoRepository empleadoRepository,
                               ClienteRepository clienteRepository,
                               MongoTemplate mongoTemplate) {
        this.capacitacionRepository = capacitacionRepository;
        this.asistenciaRepository = asistenciaRepository;
        this.empleadoRepository = empleadoRepository;
        this.clienteRepository = clienteRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public CapacitacionResponse create(CreateCapacitacionRequest req) {
        validarInstructor(req.instructorId());
        List<String> invitados = normalizarInvitados(req.modalidad(), req.clientesInvitados());

        Capacitacion c = Capacitacion.builder()
                .titulo(req.titulo())
                .descripcion(req.descripcion())
                .modulo(req.modulo())
                .modalidad(req.modalidad())
                .fechaProgramada(req.fechaProgramada())
                .duracionMinutos(req.duracionMinutos())
                .instructorId(req.instructorId())
                .clientesInvitados(invitados)
                .cupoMaximo(req.cupoMaximo())
                .estado(EstadoCapacitacion.programada)
                .build();
        Capacitacion saved = capacitacionRepository.save(c);
        return enrich(saved);
    }

    public Page<CapacitacionResponse> list(String titulo, ModuloErp modulo, ModalidadCapacitacion modalidad,
                                           EstadoCapacitacion estado, String clienteInvitadoId, Pageable pageable) {
        Query query = new Query().with(pageable);
        if (titulo != null && !titulo.isBlank()) {
            query.addCriteria(Criteria.where("titulo").regex(".*" + Pattern.quote(titulo) + ".*", "i"));
        }
        if (modulo != null) {
            query.addCriteria(Criteria.where("modulo").is(modulo.name()));
        }
        if (modalidad != null) {
            query.addCriteria(Criteria.where("modalidad").is(modalidad.name()));
        }
        if (estado != null) {
            query.addCriteria(Criteria.where("estado").is(estado.name()));
        }
        if (clienteInvitadoId != null && !clienteInvitadoId.isBlank()) {
            Criteria sinInvitados = Criteria.where("clientesInvitados").size(0);
            Criteria contieneCliente = Criteria.where("clientesInvitados").is(new org.bson.types.ObjectId(clienteInvitadoId));
            query.addCriteria(new Criteria().orOperator(sinInvitados, contieneCliente));
        }

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Capacitacion.class);
        List<Capacitacion> content = mongoTemplate.find(query, Capacitacion.class);
        List<CapacitacionResponse> dtos = content.stream().map(this::enrich).toList();
        return new PageImpl<>(dtos, pageable, total);
    }

    public CapacitacionResponse getById(String id) {
        return enrich(findOrThrow(id));
    }

    public CapacitacionResponse update(String id, UpdateCapacitacionRequest req) {
        Capacitacion c = findOrThrow(id);
        if (c.getEstado() == EstadoCapacitacion.finalizada) {
            throw new BusinessException("No se puede modificar una capacitación finalizada");
        }
        validarInstructor(req.instructorId());
        List<String> invitados = normalizarInvitados(req.modalidad(), req.clientesInvitados());

        c.setTitulo(req.titulo());
        c.setDescripcion(req.descripcion());
        c.setModulo(req.modulo());
        c.setModalidad(req.modalidad());
        c.setFechaProgramada(req.fechaProgramada());
        c.setDuracionMinutos(req.duracionMinutos());
        c.setInstructorId(req.instructorId());
        c.setClientesInvitados(invitados);
        c.setCupoMaximo(req.cupoMaximo());
        return enrich(capacitacionRepository.save(c));
    }

    public CapacitacionResponse changeEstado(String id, EstadoCapacitacion nuevo) {
        Capacitacion c = findOrThrow(id);
        c.setEstado(nuevo);
        return enrich(capacitacionRepository.save(c));
    }

    private Capacitacion findOrThrow(String id) {
        return capacitacionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Capacitacion", id));
    }

    private void validarInstructor(String instructorId) {
        if (instructorId == null || instructorId.isBlank()) return;
        if (!empleadoRepository.existsById(instructorId)) {
            throw new NotFoundException("Empleado", instructorId);
        }
    }

    private List<String> normalizarInvitados(ModalidadCapacitacion modalidad, List<String> invitados) {
        if (invitados == null) return new ArrayList<>();
        List<String> limpio = invitados.stream().filter(s -> s != null && !s.isBlank()).toList();
        if (modalidad == ModalidadCapacitacion.personalizada && limpio.isEmpty()) {
            throw new BusinessException("Capacitación personalizada requiere al menos un cliente invitado");
        }
        for (String clienteId : limpio) {
            if (!clienteRepository.existsById(clienteId)) {
                throw new NotFoundException("Cliente", clienteId);
            }
        }
        return new ArrayList<>(limpio);
    }

    private CapacitacionResponse enrich(Capacitacion c) {
        String instructorNombre = null;
        if (c.getInstructorId() != null) {
            Empleado e = empleadoRepository.findById(c.getInstructorId()).orElse(null);
            if (e != null) instructorNombre = (e.getNombre() + " " + (e.getApellido() != null ? e.getApellido() : "")).trim();
        }
        long asistencias = asistenciaRepository.countByCapacitacionId(c.getId());
        return CapacitacionResponse.from(c, instructorNombre, asistencias);
    }
}
