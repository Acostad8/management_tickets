package co.tickets.controller;

import co.tickets.dto.reportes.CountByKey;
import co.tickets.dto.reportes.DashboardSummary;
import co.tickets.dto.reportes.TicketPorDia;
import co.tickets.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@PreAuthorize("@perms.has('reportes.leer')")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/resumen")
    public ResponseEntity<DashboardSummary> resumen(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta) {
        return ResponseEntity.ok(service.resumen(desde, hasta));
    }

    @GetMapping("/tickets-por-estado")
    public ResponseEntity<List<CountByKey>> ticketsPorEstado(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta) {
        return ResponseEntity.ok(service.ticketsPorEstado(desde, hasta));
    }

    @GetMapping("/tickets-por-modulo")
    public ResponseEntity<List<CountByKey>> ticketsPorModulo(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta) {
        return ResponseEntity.ok(service.ticketsPorModulo(desde, hasta));
    }

    @GetMapping("/tickets-por-prioridad")
    public ResponseEntity<List<CountByKey>> ticketsPorPrioridad(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta) {
        return ResponseEntity.ok(service.ticketsPorPrioridad(desde, hasta));
    }

    @GetMapping("/tickets-por-tipo")
    public ResponseEntity<List<CountByKey>> ticketsPorTipo() {
        return ResponseEntity.ok(service.ticketsPorTipo());
    }

    @GetMapping("/tickets-por-dia")
    public ResponseEntity<List<TicketPorDia>> ticketsPorDia(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta) {
        return ResponseEntity.ok(service.ticketsPorDia(desde, hasta));
    }
}
