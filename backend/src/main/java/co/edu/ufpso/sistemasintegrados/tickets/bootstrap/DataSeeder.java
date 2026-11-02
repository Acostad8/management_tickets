package co.edu.ufpso.sistemasintegrados.tickets.bootstrap;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Rol;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Usuario;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoUsuario;
import co.edu.ufpso.sistemasintegrados.tickets.repository.RolRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Bean
    public ApplicationRunner seedRolesAndAdmin(RolRepository rolRepository,
                                               UsuarioRepository usuarioRepository,
                                               PasswordEncoder passwordEncoder) {
        return args -> {
            seedRoles(rolRepository);
            seedDefaultAdmin(usuarioRepository, passwordEncoder);
        };
    }

    private void seedRoles(RolRepository repo) {
        createRolIfMissing(repo, "ADMIN", "Administrador",
                "Acceso total al sistema",
                List.of(
                        "usuarios.crear", "usuarios.leer", "usuarios.actualizar", "usuarios.eliminar",
                        "roles.crear", "roles.leer", "roles.actualizar", "roles.eliminar",
                        "clientes.crear", "clientes.leer", "clientes.actualizar", "clientes.eliminar",
                        "empleados.crear", "empleados.leer", "empleados.actualizar", "empleados.eliminar",
                        "tickets.crear", "tickets.leer", "tickets.actualizar", "tickets.eliminar",
                        "tickets.asignar", "tickets.actualizar_estado", "tickets.responder",
                        "base_conocimiento.crear", "base_conocimiento.leer",
                        "base_conocimiento.actualizar", "base_conocimiento.eliminar",
                        "membresias.gestionar", "pagos.gestionar", "capacitaciones.gestionar",
                        "reportes.leer"));

        createRolIfMissing(repo, "SOPORTE", "Personal de Soporte",
                "Usuario encargado de atender tickets",
                List.of(
                        "tickets.leer", "tickets.actualizar", "tickets.actualizar_estado",
                        "tickets.responder", "tickets.asignar",
                        "base_conocimiento.crear", "base_conocimiento.leer", "base_conocimiento.actualizar",
                        "clientes.leer"));

        createRolIfMissing(repo, "CLIENTE", "Cliente externo",
                "Usuario de empresa cliente que crea y consulta sus tickets",
                List.of(
                        "tickets.crear", "tickets.leer_propios", "tickets.responder_propios",
                        "base_conocimiento.leer",
                        "capacitaciones.leer", "capacitaciones.inscribirse"));

        createRolIfMissing(repo, "VENTAS", "Equipo Comercial",
                "Gestión de clientes y membresías",
                List.of(
                        "clientes.crear", "clientes.leer", "clientes.actualizar",
                        "membresias.gestionar", "pagos.leer",
                        "reportes.leer"));
    }

    private void createRolIfMissing(RolRepository repo, String codigo, String nombre,
                                    String descripcion, List<String> permisos) {
        if (repo.existsByCodigo(codigo)) {
            return;
        }
        repo.save(Rol.builder()
                .codigo(codigo)
                .nombre(nombre)
                .descripcion(descripcion)
                .permisos(permisos)
                .activo(true)
                .build());
        log.info("Rol creado: {}", codigo);
    }

    private void seedDefaultAdmin(UsuarioRepository repo, PasswordEncoder encoder) {
        final String adminEmail = "admin@sistemasintegrados.co";
        if (repo.existsByEmail(adminEmail)) {
            return;
        }
        Usuario admin = Usuario.builder()
                .email(adminEmail)
                .passwordHash(encoder.encode("Admin1234!"))
                .nombre("Administrador")
                .apellido("del Sistema")
                .roles(List.of("ADMIN"))
                .estado(EstadoUsuario.activo)
                .intentosFallidos(0)
                .build();
        repo.save(admin);
        log.info("Usuario ADMIN por defecto creado: {} / Admin1234! — CAMBIAR INMEDIATAMENTE EN PRODUCCIÓN", adminEmail);
    }
}
