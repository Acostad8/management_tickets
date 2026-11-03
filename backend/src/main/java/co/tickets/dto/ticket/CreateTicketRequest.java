package co.tickets.dto.ticket;

import co.tickets.domain.enums.ModuloErp;
import co.tickets.domain.enums.PrioridadTicket;
import co.tickets.domain.enums.TipoTicket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record CreateTicketRequest(
        @NotBlank @Size(max = 150) String titulo,
        @NotBlank @Size(max = 4000) String descripcion,
        @NotNull TipoTicket tipo,
        @NotNull ModuloErp modulo,
        PrioridadTicket prioridad,
        String clienteId,
        Map<String, Object> detallesEspecificos) {
}
