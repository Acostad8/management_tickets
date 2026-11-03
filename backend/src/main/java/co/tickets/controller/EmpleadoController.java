package co.tickets.controller;

import co.tickets.common.PageResponse;
import co.tickets.domain.enums.AreaEmpleado;
import co.tickets.domain.enums.EstadoEmpleado;
import co.tickets.domain.enums.ModuloErp;
import co.tickets.dto.empleado.ChangeEstadoEmpleadoRequest;
import co.tickets.dto.empleado.CreateEmpleadoRequest;
import co.tickets.dto.empleado.EmpleadoResponse;
import co.tickets.dto.empleado.UpdateEmpleadoRequest;
import co.tickets.service.EmpleadoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/empleados")
public class EmpleadoController {

    private final EmpleadoService service;

    public EmpleadoController(EmpleadoService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("@perms.has('empleados.crear')")
    public ResponseEntity<EmpleadoResponse> create(@Valid @RequestBody CreateEmpleadoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @GetMapping
    @PreAuthorize("@perms.has('empleados.leer')")
    public ResponseEntity<PageResponse<EmpleadoResponse>> list(
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) AreaEmpleado area,
            @RequestParam(required = false) ModuloErp especialidad,
            @RequestParam(required = false) EstadoEmpleado estado,
            Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(service.list(codigo, nombre, area, especialidad, estado, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.has('empleados.leer')")
    public ResponseEntity<EmpleadoResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.has('empleados.actualizar')")
    public ResponseEntity<EmpleadoResponse> update(@PathVariable String id,
                                                   @Valid @RequestBody UpdateEmpleadoRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("@perms.has('empleados.actualizar')")
    public ResponseEntity<EmpleadoResponse> changeEstado(@PathVariable String id,
                                                         @Valid @RequestBody ChangeEstadoEmpleadoRequest req) {
        return ResponseEntity.ok(service.changeEstado(id, req.estado()));
    }
}
