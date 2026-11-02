package co.edu.ufpso.sistemasintegrados.tickets.controller;

import co.edu.ufpso.sistemasintegrados.tickets.common.PageResponse;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoPago;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.MedioPago;
import co.edu.ufpso.sistemasintegrados.tickets.dto.pago.AnularPagoRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.pago.CreatePagoRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.pago.PagoResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.pago.UpdatePagoRequest;
import co.edu.ufpso.sistemasintegrados.tickets.service.PagoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/pagos")
public class PagoController {

    private final PagoService service;

    public PagoController(PagoService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("@perms.has('pagos.crear')")
    public ResponseEntity<PagoResponse> create(@Valid @RequestBody CreatePagoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrarPago(req));
    }

    @GetMapping
    @PreAuthorize("@perms.has('pagos.leer')")
    public ResponseEntity<PageResponse<PagoResponse>> list(
            @RequestParam(required = false) String clienteId,
            @RequestParam(required = false) String membresiaId,
            @RequestParam(required = false) MedioPago medioPago,
            @RequestParam(required = false) EstadoPago estado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(service.list(clienteId, membresiaId, medioPago, estado, desde, hasta, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.has('pagos.leer')")
    public ResponseEntity<PagoResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("@perms.has('pagos.leer')")
    public ResponseEntity<List<PagoResponse>> getByCliente(@PathVariable String clienteId) {
        return ResponseEntity.ok(service.getByCliente(clienteId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.has('pagos.actualizar')")
    public ResponseEntity<PagoResponse> update(@PathVariable String id,
                                               @Valid @RequestBody UpdatePagoRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PostMapping("/{id}/anular")
    @PreAuthorize("@perms.has('pagos.actualizar')")
    public ResponseEntity<PagoResponse> anular(@PathVariable String id,
                                               @Valid @RequestBody AnularPagoRequest req) {
        return ResponseEntity.ok(service.anular(id, req.motivo()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perms.has('pagos.eliminar')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
