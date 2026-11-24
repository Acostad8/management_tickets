package co.tickets.dto.usuario;

import co.tickets.domain.Usuario;
import co.tickets.domain.enums.EstadoUsuario;

import java.time.Instant;
import java.util.List;

public record UsuarioResponse(
        String id,
        String email,
        String nombre,
        String apellido,
        String telefono,
        String clienteId,
        List<String> roles,
        EstadoUsuario estado,
        Instant ultimoAcceso,
        Integer intentosFallidos,
        Instant fechaCreacion,
        Instant fechaActualizacion) {

    public static UsuarioResponse from(Usuario u) {
        return new UsuarioResponse(
                u.getId(), u.getEmail(), u.getNombre(), u.getApellido(),
                u.getTelefono(), u.getClienteId(), u.getRoles(),
                u.getEstado(), u.getUltimoAcceso(), u.getIntentosFallidos(),
                u.getFechaCreacion(), u.getFechaActualizacion());
    }
}
