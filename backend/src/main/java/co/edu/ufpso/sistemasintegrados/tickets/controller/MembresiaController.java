package co.edu.ufpso.sistemasintegrados.tickets.controller;

import co.edu.ufpso.sistemasintegrados.tickets.common.PageResponse;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoMembresia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
import co.edu.ufpso.sistemasintegrados.tickets.dto.membresia.ChangeEstadoMembresiaRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.membresia.CreateMembresiaRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.membresia.MembresiaResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.membresia.UpdateMembresiaRequest;
import co.edu.ufpso.sistemasintegrados.tickets.service.MembresiaService;
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

    @DeleteMapping("/{id}")
    @PreAuthorize("@perms.has('membresias.eliminar')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("@perms.has('membresias.actualizar')")
    public ResponseEntity<MembresiaResponse> changeEstado(@PathVariable String id,
                                                          @Valid @RequestBody ChangeEstadoMembresiaRequest req) {
        return ResponseEntity.ok(service.changeEstado(id, req.estado()));
    }
}
