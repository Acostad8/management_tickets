package co.tickets.dto.ticket;

import co.tickets.domain.enums.EstadoTicket;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoRequest(
        @NotNull EstadoTicket estado) {
}
