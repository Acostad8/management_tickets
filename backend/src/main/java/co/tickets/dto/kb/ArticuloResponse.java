package co.tickets.dto.kb;

import co.tickets.domain.BaseConocimiento;
import co.tickets.domain.enums.EstadoArticulo;
import co.tickets.domain.enums.ModuloKb;

import java.time.Instant;
import java.util.List;

public record ArticuloResponse(
        String id,
        String titulo,
        String contenido,
        ModuloKb modulo,
        List<String> etiquetas,
        String ticketOrigenId,
        String autorId,
        Integer vistas,
        Integer utilidad,
        EstadoArticulo estado,
        Double score,
        Instant fechaCreacion,
        Instant fechaActualizacion) {

    public static ArticuloResponse from(BaseConocimiento a) {
        return new ArticuloResponse(
                a.getId(), a.getTitulo(), a.getContenido(), a.getModulo(),
                a.getEtiquetas(), a.getTicketOrigenId(), a.getAutorId(),
                a.getVistas(), a.getUtilidad(), a.getEstado(), null,
                a.getFechaCreacion(), a.getFechaActualizacion());
    }

    public static ArticuloResponse summary(BaseConocimiento a) {
        return new ArticuloResponse(
                a.getId(), a.getTitulo(), null, a.getModulo(),
                a.getEtiquetas(), a.getTicketOrigenId(), a.getAutorId(),
                a.getVistas(), a.getUtilidad(), a.getEstado(), null,
                a.getFechaCreacion(), a.getFechaActualizacion());
    }

    public static ArticuloResponse withScore(BaseConocimiento a, Double score) {
        return new ArticuloResponse(
                a.getId(), a.getTitulo(), null, a.getModulo(),
                a.getEtiquetas(), a.getTicketOrigenId(), a.getAutorId(),
                a.getVistas(), a.getUtilidad(), a.getEstado(), score,
                a.getFechaCreacion(), a.getFechaActualizacion());
    }
}
