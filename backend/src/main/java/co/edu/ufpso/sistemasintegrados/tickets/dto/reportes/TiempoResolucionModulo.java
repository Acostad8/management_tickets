package co.edu.ufpso.sistemasintegrados.tickets.dto.reportes;

public record TiempoResolucionModulo(
        String modulo,
        long ticketsResueltos,
        Double promedioHoras) {
}
