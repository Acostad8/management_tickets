package co.tickets.service;

import co.tickets.domain.Usuario;
import co.tickets.domain.enums.EstadoUsuario;
import co.tickets.dto.usuario.*;
import co.tickets.exception.BusinessException;
import co.tickets.exception.ConflictException;
import co.tickets.exception.NotFoundException;
import co.tickets.repository.RolRepository;
import co.tickets.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          PasswordEncoder passwordEncoder,
                          MongoTemplate mongoTemplate) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.mongoTemplate = mongoTemplate;
    }

    public UsuarioResponse create(CreateUsuarioRequest req) {
        if (usuarioRepository.existsByEmail(req.email())) {
            throw new ConflictException("Ya existe un usuario con email: " + req.email());
        }
        validateRolesExist(req.roles());

        Usuario u = Usuario.builder()
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .nombre(req.nombre())
                .apellido(req.apellido())
                .telefono(req.telefono())
                .clienteId(req.clienteId())
                .roles(req.roles())
                .estado(EstadoUsuario.activo)
                .intentosFallidos(0)
                .build();
        return UsuarioResponse.from(usuarioRepository.save(u));
    }

    public Page<UsuarioResponse> list(String email, EstadoUsuario estado, String rol, Pageable pageable) {
        Query query = new Query().with(pageable);
        if (email != null && !email.isBlank()) {
            query.addCriteria(Criteria.where("email").regex(".*" + java.util.regex.Pattern.quote(email) + ".*", "i"));
        }
        if (estado != null) {
            query.addCriteria(Criteria.where("estado").is(estado.name()));
        }
        if (rol != null && !rol.isBlank()) {
            query.addCriteria(Criteria.where("roles").is(rol));
        }

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Usuario.class);
        List<Usuario> content = mongoTemplate.find(query, Usuario.class);
        List<UsuarioResponse> dtos = content.stream().map(UsuarioResponse::from).toList();
        return new org.springframework.data.domain.PageImpl<>(dtos, pageable, total);
    }

    public UsuarioResponse getById(String id) {
        return UsuarioResponse.from(findOrThrow(id));
    }

    public UsuarioResponse update(String id, UpdateUsuarioRequest req) {
        Usuario u = findOrThrow(id);
        if (!u.getEmail().equalsIgnoreCase(req.email()) && usuarioRepository.existsByEmail(req.email())) {
            throw new ConflictException("Ya existe un usuario con email: " + req.email());
        }
        u.setEmail(req.email());
        u.setNombre(req.nombre());
        u.setApellido(req.apellido());
        u.setTelefono(req.telefono());
        u.setClienteId(req.clienteId());
        return UsuarioResponse.from(usuarioRepository.save(u));
    }

    public UsuarioResponse assignRoles(String id, AssignRolesRequest req) {
        Usuario u = findOrThrow(id);
        validateRolesExist(req.roles());
        u.setRoles(req.roles());
        return UsuarioResponse.from(usuarioRepository.save(u));
    }

    public UsuarioResponse changeEstado(String id, EstadoUsuario nuevo) {
        Usuario u = findOrThrow(id);
        u.setEstado(nuevo);
        if (nuevo == EstadoUsuario.activo) {
            u.setIntentosFallidos(0);
        }
        return UsuarioResponse.from(usuarioRepository.save(u));
    }

    public UsuarioResponse unlock(String id) {
        Usuario u = findOrThrow(id);
        if (u.getEstado() != EstadoUsuario.bloqueado) {
            throw new BusinessException("El usuario no está bloqueado");
        }
        u.setEstado(EstadoUsuario.activo);
        u.setIntentosFallidos(0);
        return UsuarioResponse.from(usuarioRepository.save(u));
    }

    private Usuario findOrThrow(String id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario", id));
    }

    private void validateRolesExist(List<String> codigos) {
        List<String> found = rolRepository.findByCodigoIn(codigos).stream()
                .map(r -> r.getCodigo()).toList();
        for (String c : codigos) {
            if (!found.contains(c)) {
                throw new BusinessException("Rol no existe: " + c);
            }
        }
    }
}
