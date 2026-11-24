package co.tickets.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearRespuestaRequest(
        @NotBlank @Size(max = 4000) String mensaje,
        Boolean esInterno) {
}
