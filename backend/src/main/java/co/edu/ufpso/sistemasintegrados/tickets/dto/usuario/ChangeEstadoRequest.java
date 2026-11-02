package co.edu.ufpso.sistemasintegrados.tickets.dto.usuario;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoUsuario;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoRequest(
        @NotNull EstadoUsuario estado) {
}
