package co.tickets.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrarSolucionRequest(
        @NotBlank @Size(max = 4000) String descripcion) {
}
