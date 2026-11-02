package co.edu.ufpso.sistemasintegrados.tickets.dto.usuario;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record AssignRolesRequest(
        @NotEmpty(message = "Debe especificar al menos un rol") List<String> roles) {
}
