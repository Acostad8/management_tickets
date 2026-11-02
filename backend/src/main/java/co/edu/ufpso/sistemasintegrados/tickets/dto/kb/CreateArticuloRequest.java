package co.edu.ufpso.sistemasintegrados.tickets.dto.kb;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoArticulo;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloKb;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateArticuloRequest(
        @NotBlank @Size(max = 200) String titulo,
        @NotBlank @Size(max = 20000) String contenido,
        @NotNull ModuloKb modulo,
        List<String> etiquetas,
        String ticketOrigenId,
        EstadoArticulo estado) {
}
