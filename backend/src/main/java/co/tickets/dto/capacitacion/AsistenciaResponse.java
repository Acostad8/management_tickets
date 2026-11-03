package co.tickets.dto.capacitacion;

import co.tickets.domain.Asistencia;

import java.time.Instant;

public record AsistenciaResponse(
        String id,
        String capacitacionId,
        String clienteId,
        String clienteRazonSocial,
        String participanteNombre,
        String participanteDocumento,
        String participanteCargo,
        String participanteEmail,
        String registradoPor,
        Instant fechaRegistro) {

    public static AsistenciaResponse from(Asistencia a) {
        return from(a, null);
    }

    public static AsistenciaResponse from(Asistencia a, String clienteRazonSocial) {
        return new AsistenciaResponse(
                a.getId(), a.getCapacitacionId(), a.getClienteId(), clienteRazonSocial,
                a.getParticipanteNombre(), a.getParticipanteDocumento(),
                a.getParticipanteCargo(), a.getParticipanteEmail(),
                a.getRegistradoPor(), a.getFechaRegistro());
    }
}
