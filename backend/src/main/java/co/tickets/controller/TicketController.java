package co.tickets.controller;

import co.tickets.common.PageResponse;
import co.tickets.domain.enums.EstadoTicket;
import co.tickets.domain.enums.ModuloErp;
import co.tickets.domain.enums.PrioridadTicket;
import co.tickets.domain.enums.TipoTicket;
import co.tickets.dto.ticket.*;
import co.tickets.security.CustomUserDetails;
import co.tickets.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("@perms.hasAny('tickets.crear')")
    public ResponseEntity<TicketResponse> create(@Valid @RequestBody CreateTicketRequest req,
                                                 @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req, principal));
    }

    @GetMapping
    @PreAuthorize("@perms.hasAny('tickets.leer', 'tickets.leer_propios')")
    public ResponseEntity<PageResponse<TicketResponse>> list(
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String clienteId,
            @RequestParam(required = false) ModuloErp modulo,
            @RequestParam(required = false) EstadoTicket estado,
            @RequestParam(required = false) PrioridadTicket prioridad,
            @RequestParam(required = false) TipoTicket tipo,
            @RequestParam(required = false) String empleadoAsignadoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant fechaHasta,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {

        var f = new TicketService.FilterParams();
        f.codigo = codigo; f.titulo = titulo; f.clienteId = clienteId;
        f.modulo = modulo; f.estado = estado; f.prioridad = prioridad; f.tipo = tipo;
        f.empleadoAsignadoId = empleadoAsignadoId;
        f.fechaDesde = fechaDesde; f.fechaHasta = fechaHasta;

        return ResponseEntity.ok(PageResponse.from(service.list(f, pageable, principal)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.hasAny('tickets.leer', 'tickets.leer_propios')")
    public ResponseEntity<TicketResponse> getById(@PathVariable String id,
                                                  @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(service.getById(id, principal));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.hasAny('tickets.actualizar', 'tickets.leer_propios')")
    public ResponseEntity<TicketResponse> update(@PathVariable String id,
                                                 @Valid @RequestBody UpdateTicketRequest req,
                                                 @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(service.update(id, req, principal));
    }

    @PatchMapping("/{id}/asignar")
    @PreAuthorize("@perms.has('tickets.asignar')")
    public ResponseEntity<TicketResponse> asignar(@PathVariable String id,
                                                  @Valid @RequestBody AsignarTicketRequest req,
                                                  @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(service.asignar(id, req.empleadoId(), principal));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("@perms.has('tickets.actualizar_estado')")
    public ResponseEntity<TicketResponse> cambiarEstado(@PathVariable String id,
                                                        @Valid @RequestBody CambiarEstadoRequest req,
                                                        @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(service.cambiarEstado(id, req.estado(), principal));
    }

    @PostMapping("/{id}/respuestas")
    @PreAuthorize("@perms.hasAny('tickets.responder', 'tickets.responder_propios')")
    public ResponseEntity<TicketResponse> crearRespuesta(@PathVariable String id,
                                                         @Valid @RequestBody CrearRespuestaRequest req,
                                                         @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(service.crearRespuesta(id, req, principal));
    }

    @PutMapping("/{id}/solucion")
    @PreAuthorize("@perms.has('tickets.actualizar')")
    public ResponseEntity<TicketResponse> registrarSolucion(@PathVariable String id,
                                                            @Valid @RequestBody RegistrarSolucionRequest req,
                                                            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(service.registrarSolucion(id, req, principal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perms.has('tickets.eliminar')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
