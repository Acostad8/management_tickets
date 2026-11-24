package co.tickets.repository;

import co.tickets.domain.Cliente;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ClienteRepository extends MongoRepository<Cliente, String> {
    Optional<Cliente> findByNit(String nit);
    boolean existsByNit(String nit);
}
