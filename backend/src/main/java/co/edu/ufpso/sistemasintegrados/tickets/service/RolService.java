package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Rol;
import co.edu.ufpso.sistemasintegrados.tickets.dto.rol.CreateRolRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.rol.RolResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.rol.UpdateRolRequest;
import co.edu.ufpso.sistemasintegrados.tickets.exception.BusinessException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.ConflictException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.NotFoundException;
import co.edu.ufpso.sistemasintegrados.tickets.repository.RolRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.UsuarioRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;
    private final MongoTemplate mongoTemplate;

    public RolService(RolRepository rolRepository,
                      UsuarioRepository usuarioRepository,
                      MongoTemplate mongoTemplate) {
        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public RolResponse create(CreateRolRequest req) {
        if (rolRepository.existsByCodigo(req.codigo())) {
            throw new ConflictException("Ya existe un rol con código: " + req.codigo());
        }
        Rol r = Rol.builder()
                .codigo(req.codigo())
                .nombre(req.nombre())
                .descripcion(req.descripcion())
                .permisos(req.permisos())
                .activo(req.activo() == null ? Boolean.TRUE : req.activo())
                .build();
        return RolResponse.from(rolRepository.save(r));
    }

    public List<RolResponse> listAll(Boolean activo) {
        List<Rol> items = (activo == null)
                ? rolRepository.findAll()
                : rolRepository.findAll().stream().filter(r -> activo.equals(r.getActivo())).toList();
        return items.stream().map(RolResponse::from).toList();
    }

    public RolResponse getById(String id) {
        return RolResponse.from(findOrThrow(id));
    }

    public RolResponse update(String id, UpdateRolRequest req) {
        Rol r = findOrThrow(id);
        r.setNombre(req.nombre());
        r.setDescripcion(req.descripcion());
        r.setPermisos(req.permisos());
        if (req.activo() != null) {
            r.setActivo(req.activo());
        }
        return RolResponse.from(rolRepository.save(r));
    }

    public void delete(String id) {
        Rol r = findOrThrow(id);
        long usersWithRole = mongoTemplate.count(
                Query.query(Criteria.where("roles").is(r.getCodigo())), "usuarios");
        if (usersWithRole > 0) {
            throw new BusinessException(
                    "No se puede eliminar: %d usuario(s) tienen asignado el rol %s".formatted(usersWithRole, r.getCodigo()));
        }
        rolRepository.delete(r);
    }

    public List<String> getCatalogoPermisos() {
        return List.of(
                "usuarios.crear", "usuarios.leer", "usuarios.actualizar", "usuarios.eliminar",
                "roles.crear", "roles.leer", "roles.actualizar", "roles.eliminar",
                "clientes.crear", "clientes.leer", "clientes.actualizar", "clientes.eliminar",
                "empleados.crear", "empleados.leer", "empleados.actualizar", "empleados.eliminar",
                "tickets.crear", "tickets.leer", "tickets.leer_propios",
                "tickets.actualizar", "tickets.actualizar_estado",
                "tickets.asignar", "tickets.responder", "tickets.responder_propios",
                "tickets.eliminar",
                "base_conocimiento.crear", "base_conocimiento.leer",
                "base_conocimiento.actualizar", "base_conocimiento.eliminar",
                "membresias.gestionar", "pagos.gestionar", "pagos.leer",
                "capacitaciones.gestionar", "capacitaciones.leer", "capacitaciones.inscribirse",
                "reportes.leer"
        );
    }

    private Rol findOrThrow(String id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rol", id));
    }
}
