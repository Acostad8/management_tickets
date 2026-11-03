package co.tickets.repository;

import co.tickets.domain.Capacitacion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CapacitacionRepository extends MongoRepository<Capacitacion, String> {
}
