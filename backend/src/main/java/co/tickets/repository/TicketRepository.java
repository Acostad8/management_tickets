package co.tickets.repository;

import co.tickets.domain.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    Optional<Ticket> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
}
