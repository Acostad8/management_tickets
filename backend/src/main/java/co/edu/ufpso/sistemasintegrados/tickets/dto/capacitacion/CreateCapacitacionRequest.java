package co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModalidadCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public record CreateCapacitacionRequest(
        @NotBlank @Size(max = 120) String titulo,
        @NotBlank @Size(max = 1000) String descripcion,
        ModuloErp modulo,
        @NotNull ModalidadCapacitacion modalidad,
        @NotNull Instant fechaProgramada,
        @Positive Integer duracionMinutos,
        String instructorId,
        List<String> clientesInvitados,
        @Positive Integer cupoMaximo) {
}
