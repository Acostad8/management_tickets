package co.tickets.dto.cliente;

import co.tickets.domain.enums.EstadoCliente;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoClienteRequest(
        @NotNull EstadoCliente estado) {
}
