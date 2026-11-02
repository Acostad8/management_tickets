package co.edu.ufpso.sistemasintegrados.tickets.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUsuarioRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(max = 60) String nombre,
        @Size(max = 60) String apellido,
        @Size(max = 30) String telefono,
        String clienteId) {
}
