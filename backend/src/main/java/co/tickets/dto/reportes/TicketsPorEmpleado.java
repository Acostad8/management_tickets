package co.tickets.dto.reportes;

public record TicketsPorEmpleado(
        String empleadoId,
        String codigoEmpleado,
        String nombre,
        String apellido,
        String area,
        long totalAsignados,
        long resueltos,
        long enProceso) {
}
