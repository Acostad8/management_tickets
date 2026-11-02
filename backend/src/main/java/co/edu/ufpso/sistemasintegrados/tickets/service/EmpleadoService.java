package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Empleado;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Usuario;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.AreaEmpleado;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoEmpleado;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
import co.edu.ufpso.sistemasintegrados.tickets.dto.empleado.CreateEmpleadoRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.empleado.EmpleadoResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.empleado.UpdateEmpleadoRequest;
import co.edu.ufpso.sistemasintegrados.tickets.exception.BusinessException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.ConflictException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.NotFoundException;
import co.edu.ufpso.sistemasintegrados.tickets.repository.EmpleadoRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.UsuarioRepository;
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
public class EmpleadoService {

    private static final String ROL_SOPORTE = "SOPORTE";

    private final EmpleadoRepository empleadoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmpleadoCounterService counterService;
    private final MongoTemplate mongoTemplate;

    public EmpleadoService(EmpleadoRepository empleadoRepository,
                           UsuarioRepository usuarioRepository,
                           EmpleadoCounterService counterService,
                           MongoTemplate mongoTemplate) {
        this.empleadoRepository = empleadoRepository;
        this.usuarioRepository = usuarioRepository;
        this.counterService = counterService;
        this.mongoTemplate = mongoTemplate;
    }

    public EmpleadoResponse create(CreateEmpleadoRequest req) {
        Usuario usuario = usuarioRepository.findById(req.usuarioId())
                .orElseThrow(() -> new NotFoundException("Usuario", req.usuarioId()));

        if (!usuario.getRoles().contains(ROL_SOPORTE)) {
            throw new BusinessException("El usuario debe tener el rol SOPORTE para crear un empleado");
        }
        if (empleadoRepository.existsByUsuarioId(req.usuarioId())) {
            throw new ConflictException("El usuario ya tiene un empleado asociado");
        }

        Empleado e = Empleado.builder()
                .codigoEmpleado(counterService.nextCodigo())
                .usuarioId(req.usuarioId())
                .nombre(req.nombre())
                .apellido(req.apellido())
                .email(req.email())
                .telefono(req.telefono())
                .area(req.area())
                .cargo(req.cargo())
                .especialidad(req.especialidad() != null ? req.especialidad() : new ArrayList<>())
                .nivel(req.nivel())
                .estado(EstadoEmpleado.activo)
                .fechaIngreso(req.fechaIngreso())
                .build();
        return EmpleadoResponse.from(empleadoRepository.save(e));
    }

    public Page<EmpleadoResponse> list(String codigo, String nombre, AreaEmpleado area,
                                       ModuloErp especialidad, EstadoEmpleado estado, Pageable pageable) {
        Query query = new Query().with(pageable);
        if (codigo != null && !codigo.isBlank()) {
            query.addCriteria(Criteria.where("codigoEmpleado").regex(".*" + Pattern.quote(codigo) + ".*", "i"));
        }
        if (nombre != null && !nombre.isBlank()) {
            String rx = ".*" + Pattern.quote(nombre) + ".*";
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("nombre").regex(rx, "i"),
                    Criteria.where("apellido").regex(rx, "i")));
        }
        if (area != null) {
            query.addCriteria(Criteria.where("area").is(area.name()));
        }
        if (especialidad != null) {
            query.addCriteria(Criteria.where("especialidad").is(especialidad.name()));
        }
        if (estado != null) {
            query.addCriteria(Criteria.where("estado").is(estado.name()));
        }

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Empleado.class);
        List<Empleado> content = mongoTemplate.find(query, Empleado.class);
        List<EmpleadoResponse> dtos = content.stream().map(EmpleadoResponse::from).toList();
        return new PageImpl<>(dtos, pageable, total);
    }

    public EmpleadoResponse getById(String id) {
        return EmpleadoResponse.from(findOrThrow(id));
    }

    public EmpleadoResponse update(String id, UpdateEmpleadoRequest req) {
        Empleado e = findOrThrow(id);
        e.setNombre(req.nombre());
        e.setApellido(req.apellido());
        e.setEmail(req.email());
        e.setTelefono(req.telefono());
        e.setArea(req.area());
        e.setCargo(req.cargo());
        e.setEspecialidad(req.especialidad() != null ? req.especialidad() : new ArrayList<>());
        e.setNivel(req.nivel());
        e.setFechaIngreso(req.fechaIngreso());
        return EmpleadoResponse.from(empleadoRepository.save(e));
    }

    public EmpleadoResponse changeEstado(String id, EstadoEmpleado nuevo) {
        Empleado e = findOrThrow(id);
        e.setEstado(nuevo);
        return EmpleadoResponse.from(empleadoRepository.save(e));
    }

    private Empleado findOrThrow(String id) {
        return empleadoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Empleado", id));
    }
}
