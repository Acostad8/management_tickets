package co.tickets.dto.pago;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AnularPagoRequest(
        @NotBlank @Size(max = 300) String motivo) {
}
