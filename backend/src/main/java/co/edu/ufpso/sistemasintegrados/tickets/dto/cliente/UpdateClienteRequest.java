package co.edu.ufpso.sistemasintegrados.tickets.dto.cliente;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateClienteRequest(
        @NotBlank @Size(max = 120) String razonSocial,
        @Size(max = 80) String nombreContacto,
        @Email @Size(max = 120) String emailContacto,
        @Size(max = 30) String telefono,
        @Size(max = 150) String direccion,
        @Size(max = 60) String ciudad,
        @Size(max = 60) String pais) {
}
