package co.tickets.dto.membresia;

import co.tickets.domain.enums.ModuloErp;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CreateMembresiaRequest(
        @NotBlank String clienteId,
        @NotBlank @Size(max = 50) String plan,
        @NotEmpty(message = "Debe contratar al menos un módulo") List<ModuloErp> modulosContratados,
        @NotNull LocalDate fechaInicio,
        @NotNull LocalDate fechaVencimiento,
        @PositiveOrZero BigDecimal precio) {
}
