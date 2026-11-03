package co.tickets.controller;

import co.tickets.common.PageResponse;
import co.tickets.domain.enums.EstadoMembresia;
import co.tickets.domain.enums.ModuloErp;
import co.tickets.dto.membresia.ChangeEstadoMembresiaRequest;
import co.tickets.dto.membresia.CreateMembresiaRequest;
import co.tickets.dto.membresia.MembresiaResponse;
import co.tickets.dto.membresia.UpdateMembresiaRequest;
import co.tickets.service.MembresiaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/membresias")
public class MembresiaController {

    private final MembresiaService service;

    public MembresiaController(MembresiaService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("@perms.has('membresias.crear')")
    public ResponseEntity<MembresiaResponse> create(@Valid @RequestBody CreateMembresiaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @GetMapping
    @PreAuthorize("@perms.has('membresias.leer')")
    public ResponseEntity<PageResponse<MembresiaResponse>> list(
            @RequestParam(required = false) String clienteId,
            @RequestParam(required = false) EstadoMembresia estado,
            @RequestParam(required = false) ModuloErp modulo,
            @RequestParam(required = false) String plan,
            Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(service.list(clienteId, estado, modulo, plan, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.has('membresias.leer')")
    public ResponseEntity<MembresiaResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("@perms.has('membresias.leer')")
    public ResponseEntity<List<MembresiaResponse>> getByCliente(@PathVariable String clienteId) {
        return ResponseEntity.ok(service.getByCliente(clienteId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.has('membresias.actualizar')")
    public ResponseEntity<MembresiaResponse> update(@PathVariable String id,
                                                    @Valid @RequestBody UpdateMembresiaRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("@perms.has('membresias.actualizar')")
    public ResponseEntity<MembresiaResponse> changeEstado(@PathVariable String id,
                                                          @Valid @RequestBody ChangeEstadoMembresiaRequest req) {
        return ResponseEntity.ok(service.changeEstado(id, req.estado()));
    }
}
