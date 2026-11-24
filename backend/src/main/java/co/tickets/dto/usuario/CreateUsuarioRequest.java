package co.tickets.dto.usuario;

import co.tickets.common.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateUsuarioRequest(
        @NotBlank @Email String email,
        @ValidPassword String password,
        @NotBlank @Size(max = 60) String nombre,
        @Size(max = 60) String apellido,
        @Size(max = 30) String telefono,
        String clienteId,
        @NotEmpty(message = "Debe asignarse al menos un rol") List<String> roles) {
}
