package co.tickets.dto.rol;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateRolRequest(
        @NotBlank @Pattern(regexp = "^[A-Z_]+$", message = "codigo debe ser UPPER_SNAKE_CASE") @Size(max = 30) String codigo,
        @NotBlank @Size(max = 60) String nombre,
        @Size(max = 200) String descripcion,
        @NotNull List<String> permisos,
        Boolean activo) {
}
