package co.tickets.repository;

import co.tickets.domain.BaseConocimiento;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BaseConocimientoRepository extends MongoRepository<BaseConocimiento, String> {
}
