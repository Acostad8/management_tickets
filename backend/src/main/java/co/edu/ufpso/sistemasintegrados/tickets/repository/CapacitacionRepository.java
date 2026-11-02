package co.edu.ufpso.sistemasintegrados.tickets.repository;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Capacitacion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CapacitacionRepository extends MongoRepository<Capacitacion, String> {
}
