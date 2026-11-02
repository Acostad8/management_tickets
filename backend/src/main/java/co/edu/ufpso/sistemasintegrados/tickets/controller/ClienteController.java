package co.edu.ufpso.sistemasintegrados.tickets.controller;

import co.edu.ufpso.sistemasintegrados.tickets.common.PageResponse;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoCliente;
import co.edu.ufpso.sistemasintegrados.tickets.dto.cliente.ChangeEstadoClienteRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.cliente.ClienteResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.cliente.CreateClienteRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.cliente.UpdateClienteRequest;
import co.edu.ufpso.sistemasintegrados.tickets.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("@perms.has('clientes.crear')")
    public ResponseEntity<ClienteResponse> create(@Valid @RequestBody CreateClienteRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @GetMapping
    @PreAuthorize("@perms.has('clientes.leer')")
    public ResponseEntity<PageResponse<ClienteResponse>> list(
            @RequestParam(required = false) String nit,
            @RequestParam(required = false) String razonSocial,
            @RequestParam(required = false) String ciudad,
            @RequestParam(required = false) EstadoCliente estado,
            Pageable pageable) {
        return ResponseEntity.ok(PageResponse.from(service.list(nit, razonSocial, ciudad, estado, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("@perms.has('clientes.leer')")
    public ResponseEntity<ClienteResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@perms.has('clientes.actualizar')")
    public ResponseEntity<ClienteResponse> update(@PathVariable String id,
                                                  @Valid @RequestBody UpdateClienteRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@perms.has('clientes.eliminar')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("@perms.has('clientes.actualizar')")
    public ResponseEntity<ClienteResponse> changeEstado(@PathVariable String id,
                                                        @Valid @RequestBody ChangeEstadoClienteRequest req) {
        return ResponseEntity.ok(service.changeEstado(id, req.estado()));
    }
}
