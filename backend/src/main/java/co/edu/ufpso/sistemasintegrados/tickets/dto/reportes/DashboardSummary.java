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
        Double promedioHorasResolucion,
        long membresiasActivas,
        long membresiasPorVencer,
        long capacitacionesProximas,
        List<CountByKey> ticketsPorPrioridad,
        List<CountByKey> ticketsPorModulo) {
}
