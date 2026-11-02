package co.edu.ufpso.sistemasintegrados.tickets.dto.reportes;

import java.util.List;

public record DashboardSummary(
        long totalTickets,
        long ticketsAbiertos,
        long ticketsResueltos,
        long ticketsCerrados,
        long ticketsNuevos,
        long ticketsEnProceso,
        long ticketsEnEspera,
        long totalArticulosKb,
        long totalUsuarios,
        long totalClientes,
        List<CountByKey> ticketsPorPrioridad,
        List<CountByKey> ticketsPorModulo) {
}
