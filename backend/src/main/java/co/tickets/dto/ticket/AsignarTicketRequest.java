package co.tickets.dto.ticket;

import jakarta.validation.constraints.NotBlank;

public record AsignarTicketRequest(
        @NotBlank String empleadoId) {
}
