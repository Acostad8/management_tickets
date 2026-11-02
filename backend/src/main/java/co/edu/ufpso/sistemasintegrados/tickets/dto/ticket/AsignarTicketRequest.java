package co.edu.ufpso.sistemasintegrados.tickets.dto.ticket;

import jakarta.validation.constraints.NotBlank;

public record AsignarTicketRequest(
        @NotBlank String empleadoId) {
}
