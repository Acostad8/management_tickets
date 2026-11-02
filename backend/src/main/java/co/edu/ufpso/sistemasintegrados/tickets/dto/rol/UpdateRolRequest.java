package co.edu.ufpso.sistemasintegrados.tickets.dto.rol;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UpdateRolRequest(
        @NotBlank @Size(max = 60) String nombre,
        @Size(max = 200) String descripcion,
        @NotNull List<String> permisos,
        Boolean activo) {
}
