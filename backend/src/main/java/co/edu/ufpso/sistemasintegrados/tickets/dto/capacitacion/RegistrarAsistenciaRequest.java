package co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrarAsistenciaRequest(
        @NotBlank String clienteId,
        @NotBlank @Size(max = 100) String participanteNombre,
        @NotBlank @Size(max = 30) String participanteDocumento,
        @Size(max = 80) String participanteCargo,
        @Email @Size(max = 120) String participanteEmail) {
}
