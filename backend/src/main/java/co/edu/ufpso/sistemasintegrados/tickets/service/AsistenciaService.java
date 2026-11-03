package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Asistencia;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Capacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.Cliente;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModalidadCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion.AsistenciaResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.capacitacion.RegistrarAsistenciaRequest;
import co.edu.ufpso.sistemasintegrados.tickets.exception.BusinessException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.ConflictException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.NotFoundException;
import co.edu.ufpso.sistemasintegrados.tickets.repository.AsistenciaRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.CapacitacionRepository;
import co.edu.ufpso.sistemasintegrados.tickets.repository.ClienteRepository;
import co.edu.ufpso.sistemasintegrados.tickets.security.CustomUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final CapacitacionRepository capacitacionRepository;
    private final ClienteRepository clienteRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository,
                             CapacitacionRepository capacitacionRepository,
                             ClienteRepository clienteRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.capacitacionRepository = capacitacionRepository;
        this.clienteRepository = clienteRepository;
    }

    public AsistenciaResponse registrar(String capacitacionId, RegistrarAsistenciaRequest req) {
        Capacitacion cap = capacitacionRepository.findById(capacitacionId)
                .orElseThrow(() -> new NotFoundException("Capacitacion", capacitacionId));

        if (cap.getEstado() == EstadoCapacitacion.cancelada) {
            throw new BusinessException("La capacitación está cancelada");
        }
        if (cap.getEstado() == EstadoCapacitacion.finalizada) {
            throw new BusinessException("La capacitación ya finalizó");
        }

        Cliente cliente = clienteRepository.findById(req.clienteId())
                .orElseThrow(() -> new NotFoundException("Cliente", req.clienteId()));

        if (cap.getModalidad() == ModalidadCapacitacion.personalizada
                && (cap.getClientesInvitados() == null || !cap.getClientesInvitados().contains(req.clienteId()))) {
            throw new BusinessException("El cliente no está invitado a esta capacitación personalizada");
        }
        if (cap.getModalidad() == ModalidadCapacitacion.masiva
                && cap.getClientesInvitados() != null && !cap.getClientesInvitados().isEmpty()
                && !cap.getClientesInvitados().contains(req.clienteId())) {
            throw new BusinessException("El cliente no está invitado a esta capacitación");
        }

        if (asistenciaRepository.existsByCapacitacionIdAndParticipanteDocumento(capacitacionId, req.participanteDocumento())) {
            throw new ConflictException("Ya existe asistencia registrada con documento " + req.participanteDocumento());
        }

        if (cap.getCupoMaximo() != null) {
            long actuales = asistenciaRepository.countByCapacitacionId(capacitacionId);
            if (actuales >= cap.getCupoMaximo()) {
                throw new BusinessException("Cupo máximo alcanzado (" + cap.getCupoMaximo() + ")");
            }
        }

        Asistencia a = Asistencia.builder()
                .capacitacionId(capacitacionId)
                .clienteId(req.clienteId())
                .participanteNombre(req.participanteNombre())
                .participanteDocumento(req.participanteDocumento())
                .participanteCargo(req.participanteCargo())
                .participanteEmail(req.participanteEmail())
                .registradoPor(currentUserId())
                .build();
        Asistencia saved = asistenciaRepository.save(a);
        return AsistenciaResponse.from(saved, cliente.getRazonSocial());
    }

    public List<AsistenciaResponse> listByCapacitacion(String capacitacionId) {
        if (!capacitacionRepository.existsById(capacitacionId)) {
            throw new NotFoundException("Capacitacion", capacitacionId);
        }
        List<Asistencia> rows = asistenciaRepository.findByCapacitacionIdOrderByFechaRegistroAsc(capacitacionId);
        Map<String, String> clientes = loadClienteNames(rows);
        return rows.stream().map(a -> AsistenciaResponse.from(a, clientes.get(a.getClienteId()))).toList();
    }

    public void delete(String id) {
        Asistencia a = asistenciaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Asistencia", id));
        asistenciaRepository.delete(a);
    }

    private String currentUserId() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof CustomUserDetails cud) return cud.getUsuarioId();
        } catch (Exception ignored) { }
        return null;
    }

    private Map<String, String> loadClienteNames(List<Asistencia> rows) {
        Set<String> ids = rows.stream().map(Asistencia::getClienteId).collect(Collectors.toSet());
        Map<String, String> result = new HashMap<>();
        clienteRepository.findAllById(ids).forEach(c -> result.put(c.getId(), c.getRazonSocial()));
        return result;
    }
}
