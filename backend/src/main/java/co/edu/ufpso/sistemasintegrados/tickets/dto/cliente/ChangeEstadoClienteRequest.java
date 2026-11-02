package co.edu.ufpso.sistemasintegrados.tickets.dto.cliente;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoCliente;
import jakarta.validation.constraints.NotNull;

public record ChangeEstadoClienteRequest(
        @NotNull EstadoCliente estado) {
}
