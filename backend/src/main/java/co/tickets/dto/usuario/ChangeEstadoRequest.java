package co.tickets.dto.usuario;

import co.tickets.domain.enums.EstadoUsuario;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoRequest(
        @NotNull EstadoUsuario estado) {
}
