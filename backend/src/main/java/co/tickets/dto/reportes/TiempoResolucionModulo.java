package co.tickets.dto.reportes;

public record TiempoResolucionModulo(
        String modulo,
        long ticketsResueltos,
        Double promedioHoras) {
}
