package co.tickets.controller;

import co.tickets.dto.reportes.TicketsPorCliente;
import co.tickets.dto.reportes.TicketsPorEmpleado;
import co.tickets.dto.reportes.TiempoResolucionModulo;
import co.tickets.service.ReporteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reportes")
@PreAuthorize("@perms.has('reportes.leer')")
public class ReporteController {

    private final ReporteService service;

    public ReporteController(ReporteService service) {
        this.service = service;
    }

    @GetMapping("/tickets-por-cliente")
    public ResponseEntity<List<TicketsPorCliente>> ticketsPorCliente(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(service.ticketsPorCliente(limit));
    }

    @GetMapping("/tickets-por-empleado")
    public ResponseEntity<List<TicketsPorEmpleado>> ticketsPorEmpleado(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(service.ticketsPorEmpleado(limit));
    }

    @GetMapping("/tiempo-resolucion-modulo")
    public ResponseEntity<List<TiempoResolucionModulo>> tiempoResolucionPorModulo() {
        return ResponseEntity.ok(service.tiempoResolucionPorModulo());
    }
}
