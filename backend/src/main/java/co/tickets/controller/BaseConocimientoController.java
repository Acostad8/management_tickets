package co.tickets.controller;

import co.tickets.common.PageResponse;
import co.tickets.domain.enums.EstadoArticulo;
import co.tickets.domain.enums.ModuloKb;
import co.tickets.dto.kb.*;
import co.tickets.security.CustomUserDetails;
import co.tickets.service.BaseConocimientoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/base-conocimiento")
public class BaseConocimientoController {

    private final BaseConocimientoService service;

    public BaseConocimientoController(BaseConocimientoService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("@perms.has('base_conocimiento.crear')")
    public ResponseEntity<ArticuloResponse> create(@Valid @RequestBody CreateArticuloRequest req,
                                                   @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req, principal));
    }

    @GetMapping
    @PreAuthorize("@perms.has('base_conocimiento.leer')")
    public ResponseEntity<PageResponse<ArticuloResponse>> list(
            @RequestParam(required = false) ModuloKb modulo,
            @RequestParam(required = false) EstadoArticulo estado,
            @RequestParam(required = false) String etiqueta,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        boolean onlyPublished = !hasFullAccess(principal);
        return ResponseEntity.ok(PageResponse.from(service.list(modulo, estado, etiqueta, pageable, onlyPublished)));
    }

    @GetMapping("/buscar")
    @PreAuthorize("@perms.has('base_conocimiento.leer')")
    public ResponseEntity<PageResponse<ArticuloResponse>> search(
            @RequestParam String q,
            @RequestParam(required = false) ModuloKb modulo,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        boolean onlyPublished = !hasFullAccess(principal);
        return ResponseEntity.ok(PageResponse.from(service.search(q, modulo, pageable, onlyPublished)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.has('base_conocimiento.leer')")
    public ResponseEntity<ArticuloResponse> getById(@PathVariable String id,
                                                    @AuthenticationPrincipal CustomUserDetails principal) {
        boolean onlyPublished = !hasFullAccess(principal);
        return ResponseEntity.ok(service.getById(id, true, onlyPublished));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.has('base_conocimiento.actualizar')")
    public ResponseEntity<ArticuloResponse> update(@PathVariable String id,
                                                   @Valid @RequestBody UpdateArticuloRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("@perms.has('base_conocimiento.actualizar')")
    public ResponseEntity<ArticuloResponse> cambiarEstado(@PathVariable String id,
                                                          @Valid @RequestBody CambiarEstadoArticuloRequest req) {
        return ResponseEntity.ok(service.cambiarEstado(id, req.estado()));
    }

    @PostMapping("/{id}/util")
    @PreAuthorize("@perms.has('base_conocimiento.leer')")
    public ResponseEntity<ArticuloResponse> votarUtil(@PathVariable String id) {
        return ResponseEntity.ok(service.incrementarUtilidad(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perms.has('base_conocimiento.eliminar')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private boolean hasFullAccess(CustomUserDetails principal) {
        return principal.getPermisos().contains("*")
                || principal.getPermisos().contains("base_conocimiento.actualizar")
                || principal.getPermisos().contains("base_conocimiento.crear");
    }
}
