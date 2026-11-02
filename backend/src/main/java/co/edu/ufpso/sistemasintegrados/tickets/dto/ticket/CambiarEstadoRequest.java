package co.edu.ufpso.sistemasintegrados.tickets.dto.ticket;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoTicket;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoRequest(
        @NotNull EstadoTicket estado) {
}
