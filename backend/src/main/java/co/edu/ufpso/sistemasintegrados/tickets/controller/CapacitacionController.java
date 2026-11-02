package co.edu.ufpso.sistemasintegrados.tickets.controller;

import co.edu.ufpso.sistemasintegrados.tickets.common.PageResponse;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModalidadCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
import co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion.*;
import co.edu.ufpso.sistemasintegrados.tickets.service.AsistenciaService;
import co.edu.ufpso.sistemasintegrados.tickets.service.CapacitacionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/capacitaciones")
public class CapacitacionController {

    private final CapacitacionService capacitacionService;
    private final AsistenciaService asistenciaService;

    public CapacitacionController(CapacitacionService capacitacionService,
                                  AsistenciaService asistenciaService) {
        this.capacitacionService = capacitacionService;
        this.asistenciaService = asistenciaService;
    }

    @PostMapping
    @PreAuthorize("@perms.has('capacitaciones.crear')")
    public ResponseEntity<CapacitacionResponse> create(@Valid @RequestBody CreateCapacitacionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(capacitacionService.create(req));
    }

    @GetMapping
    @PreAuthorize("@perms.has('capacitaciones.leer')")
    public ResponseEntity<PageResponse<CapacitacionResponse>> list(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) ModuloErp modulo,
            @RequestParam(required = false) ModalidadCapacitacion modalidad,
            @RequestParam(required = false) EstadoCapacitacion estado,
            @RequestParam(required = false) String clienteInvitadoId,
            Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(
                capacitacionService.list(titulo, modulo, modalidad, estado, clienteInvitadoId, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.has('capacitaciones.leer')")
    public ResponseEntity<CapacitacionResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(capacitacionService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.has('capacitaciones.actualizar')")
    public ResponseEntity<CapacitacionResponse> update(@PathVariable String id,
                                                       @Valid @RequestBody UpdateCapacitacionRequest req) {
        return ResponseEntity.ok(capacitacionService.update(id, req));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("@perms.has('capacitaciones.actualizar')")
    public ResponseEntity<CapacitacionResponse> changeEstado(@PathVariable String id,
                                                             @Valid @RequestBody ChangeEstadoCapacitacionRequest req) {
        return ResponseEntity.ok(capacitacionService.changeEstado(id, req.estado()));
    }

    @GetMapping("/{id}/asistencias")
    @PreAuthorize("@perms.has('asistencias.leer') or @perms.has('capacitaciones.leer')")
    public ResponseEntity<List<AsistenciaResponse>> listAsistencias(@PathVariable String id) {
        return ResponseEntity.ok(asistenciaService.listByCapacitacion(id));
    }

    @PostMapping("/{id}/asistencias")
    @PreAuthorize("@perms.has('asistencias.registrar')")
    public ResponseEntity<AsistenciaResponse> registrarAsistencia(@PathVariable String id,
                                                                  @Valid @RequestBody RegistrarAsistenciaRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(asistenciaService.registrar(id, req));
    }

    @DeleteMapping("/asistencias/{asistenciaId}")
    @PreAuthorize("@perms.has('asistencias.eliminar')")
    public ResponseEntity<Void> deleteAsistencia(@PathVariable String asistenciaId) {
        asistenciaService.delete(asistenciaId);
        return ResponseEntity.noContent().build();
    }
}
