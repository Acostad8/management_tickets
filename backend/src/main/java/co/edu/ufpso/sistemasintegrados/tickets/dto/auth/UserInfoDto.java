package co.edu.ufpso.sistemasintegrados.tickets.dto.auth;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Usuario;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoUsuario;

import java.util.List;

public record UserInfoDto(
        String id,
        String email,
        String nombre,
        String apellido,
        String clienteId,
        List<String> roles,
        List<String> permisos,
        EstadoUsuario estado) {

    public static UserInfoDto from(Usuario u, List<String> permisos) {
        return new UserInfoDto(
                u.getId(),
                u.getEmail(),
                u.getNombre(),
                u.getApellido(),
                u.getClienteId(),
                u.getRoles(),
                permisos,
                u.getEstado());
    }
}
