package co.edu.ufpso.sistemasintegrados.tickets.dto.pago;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Pago;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoPago;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.MedioPago;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record PagoResponse(
        String id,
        String clienteId,
        String clienteRazonSocial,
        String membresiaId,
        String membresiaPlan,
        BigDecimal valor,
        LocalDate fechaPago,
        MedioPago medioPago,
        String referencia,
        String observaciones,
        EstadoPago estado,
        String registradoPor,
        Instant fechaCreacion,
        Instant fechaActualizacion) {

    public static PagoResponse from(Pago p) {
        return from(p, null, null);
    }

    public static PagoResponse from(Pago p, String clienteRazonSocial, String membresiaPlan) {
        return new PagoResponse(
                p.getId(), p.getClienteId(), clienteRazonSocial,
                p.getMembresiaId(), membresiaPlan,
                p.getValor(), p.getFechaPago(), p.getMedioPago(),
                p.getReferencia(), p.getObservaciones(), p.getEstado(),
                p.getRegistradoPor(),
                p.getFechaCreacion(), p.getFechaActualizacion());
    }
}
