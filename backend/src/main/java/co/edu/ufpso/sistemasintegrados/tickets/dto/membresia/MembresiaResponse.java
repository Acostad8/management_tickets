package co.edu.ufpso.sistemasintegrados.tickets.dto.membresia;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Membresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoMembresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record MembresiaResponse(
        String id,
        String clienteId,
        String clienteRazonSocial,
        String plan,
        List<ModuloErp> modulosContratados,
        EstadoMembresia estado,
        LocalDate fechaInicio,
        LocalDate fechaVencimiento,
        BigDecimal precio,
        Boolean pagoAlDia,
        Instant fechaCreacion,
        Instant fechaActualizacion) {

    public static MembresiaResponse from(Membresia m) {
        return from(m, null);
    }

    public static MembresiaResponse from(Membresia m, String clienteRazonSocial) {
        return new MembresiaResponse(
                m.getId(), m.getClienteId(), clienteRazonSocial, m.getPlan(),
                m.getModulosContratados(), m.getEstado(),
                m.getFechaInicio(), m.getFechaVencimiento(),
                m.getPrecio(), m.getPagoAlDia(),
                m.getFechaCreacion(), m.getFechaActualizacion());
    }
}
