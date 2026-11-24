package co.tickets.dto.pago;

import co.tickets.domain.enums.MedioPago;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreatePagoRequest(
        @NotBlank String clienteId,
        String membresiaId,
        @NotNull @Positive BigDecimal valor,
        @NotNull LocalDate fechaPago,
        @NotNull MedioPago medioPago,
        @Size(max = 80) String referencia,
        @Size(max = 300) String observaciones) {
}
