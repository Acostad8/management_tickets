package co.edu.ufpso.sistemasintegrados.tickets.dto.rol;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Rol;

import java.time.Instant;
import java.util.List;

public record RolResponse(
        String id,
        String codigo,
        String nombre,
        String descripcion,
        List<String> permisos,
        Boolean activo,
        Instant fechaCreacion,
        Instant fechaActualizacion) {

    public static RolResponse from(Rol r) {
        return new RolResponse(
                r.getId(), r.getCodigo(), r.getNombre(), r.getDescripcion(),
                r.getPermisos(), r.getActivo(),
                r.getFechaCreacion(), r.getFechaActualizacion());
    }
}
