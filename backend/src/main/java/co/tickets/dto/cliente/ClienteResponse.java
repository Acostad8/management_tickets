package co.tickets.dto.cliente;

import co.tickets.domain.Cliente;
import co.tickets.domain.enums.EstadoCliente;

import java.time.Instant;

public record ClienteResponse(
        String id,
        String nit,
        String razonSocial,
        String nombreContacto,
        String emailContacto,
        String telefono,
        String direccion,
        String ciudad,
        String pais,
        EstadoCliente estado,
        Instant fechaCreacion,
        Instant fechaActualizacion) {

    public static ClienteResponse from(Cliente c) {
        return new ClienteResponse(
                c.getId(), c.getNit(), c.getRazonSocial(),
                c.getNombreContacto(), c.getEmailContacto(), c.getTelefono(),
                c.getDireccion(), c.getCiudad(), c.getPais(),
                c.getEstado(), c.getFechaCreacion(), c.getFechaActualizacion());
    }
}
