package co.edu.ufpso.sistemasintegrados.tickets.controller;

import co.edu.ufpso.sistemasintegrados.tickets.common.PageResponse;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoUsuario;
import co.edu.ufpso.sistemasintegrados.tickets.dto.usuario.*;
import co.edu.ufpso.sistemasintegrados.tickets.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("@perms.has('usuarios.crear')")
    public ResponseEntity<UsuarioResponse> create(@Valid @RequestBody CreateUsuarioRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @GetMapping
    @PreAuthorize("@perms.has('usuarios.leer')")
    public ResponseEntity<PageResponse<UsuarioResponse>> list(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) EstadoUsuario estado,
            @RequestParam(required = false) String rol,
            Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(service.list(email, estado, rol, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.has('usuarios.leer') or @perms.isSelf(#id)")
    public ResponseEntity<UsuarioResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.has('usuarios.actualizar') or @perms.isSelf(#id)")
    public ResponseEntity<UsuarioResponse> update(@PathVariable String id,
                                                  @Valid @RequestBody UpdateUsuarioRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perms.has('usuarios.eliminar')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/roles")
    @PreAuthorize("@perms.has('usuarios.actualizar')")
    public ResponseEntity<UsuarioResponse> assignRoles(@PathVariable String id,
                                                       @Valid @RequestBody AssignRolesRequest req) {
        return ResponseEntity.ok(service.assignRoles(id, req));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("@perms.has('usuarios.actualizar')")
    public ResponseEntity<UsuarioResponse> changeEstado(@PathVariable String id,
                                                        @Valid @RequestBody ChangeEstadoRequest req) {
        return ResponseEntity.ok(service.changeEstado(id, req.estado()));
    }

    @PostMapping("/{id}/unlock")
    @PreAuthorize("@perms.has('usuarios.actualizar')")
    public ResponseEntity<UsuarioResponse> unlock(@PathVariable String id) {
        return ResponseEntity.ok(service.unlock(id));
    }
}
