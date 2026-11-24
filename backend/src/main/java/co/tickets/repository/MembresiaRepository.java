package co.tickets.repository;

import co.tickets.domain.Membresia;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MembresiaRepository extends MongoRepository<Membresia, String> {
    List<Membresia> findByClienteId(String clienteId);
    boolean existsByClienteIdAndEstado(String clienteId, co.tickets.domain.enums.EstadoMembresia estado);
}
