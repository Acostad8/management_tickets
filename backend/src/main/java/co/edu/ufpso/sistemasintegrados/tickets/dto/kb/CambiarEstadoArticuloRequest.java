package co.edu.ufpso.sistemasintegrados.tickets.dto.kb;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoArticulo;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoArticuloRequest(
        @NotNull EstadoArticulo estado) {
}
