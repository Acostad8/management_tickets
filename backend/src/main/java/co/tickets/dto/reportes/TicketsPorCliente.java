package co.tickets.dto.reportes;

public record TicketsPorCliente(
        String clienteId,
        String nit,
        String razonSocial,
        long totalTickets,
        long ticketsAbiertos,
        long ticketsResueltos) {
}
