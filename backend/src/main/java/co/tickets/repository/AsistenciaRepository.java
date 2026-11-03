package co.tickets.repository;

import co.tickets.domain.Asistencia;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AsistenciaRepository extends MongoRepository<Asistencia, String> {
    List<Asistencia> findByCapacitacionIdOrderByFechaRegistroAsc(String capacitacionId);
    List<Asistencia> findByClienteIdOrderByFechaRegistroDesc(String clienteId);
    boolean existsByCapacitacionIdAndParticipanteDocumento(String capacitacionId, String participanteDocumento);
    long countByCapacitacionId(String capacitacionId);
}
