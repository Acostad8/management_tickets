package co.tickets.dto.ticket;

import co.tickets.domain.enums.PrioridadTicket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record UpdateTicketRequest(
        @NotBlank @Size(max = 150) String titulo,
        @NotBlank @Size(max = 4000) String descripcion,
        PrioridadTicket prioridad,
        Map<String, Object> detallesEspecificos) {
}
