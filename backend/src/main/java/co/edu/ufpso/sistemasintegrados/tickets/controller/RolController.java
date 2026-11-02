package co.edu.ufpso.sistemasintegrados.tickets.controller;

import co.edu.ufpso.sistemasintegrados.tickets.dto.rol.CreateRolRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.rol.RolResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.rol.UpdateRolRequest;
import co.edu.ufpso.sistemasintegrados.tickets.service.RolService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roles")
public class RolController {

    private final RolService service;

    public RolController(RolService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("@perms.has('roles.crear')")
    public ResponseEntity<RolResponse> create(@Valid @RequestBody CreateRolRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @GetMapping
    @PreAuthorize("@perms.has('roles.leer')")
    public ResponseEntity<List<RolResponse>> list(@RequestParam(required = false) Boolean activo) {
        return ResponseEntity.ok(service.listAll(activo));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.has('roles.leer')")
    public ResponseEntity<RolResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.has('roles.actualizar')")
    public ResponseEntity<RolResponse> update(@PathVariable String id,
                                              @Valid @RequestBody UpdateRolRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perms.has('roles.eliminar')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/catalogo/permisos")
    @PreAuthorize("@perms.has('roles.leer')")
    public ResponseEntity<List<String>> catalogoPermisos() {
        return ResponseEntity.ok(service.getCatalogoPermisos());
    }
}
