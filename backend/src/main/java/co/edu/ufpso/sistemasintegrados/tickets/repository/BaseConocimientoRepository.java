package co.edu.ufpso.sistemasintegrados.tickets.repository;

import co.edu.ufpso.sistemasintegrados.tickets.domain.BaseConocimiento;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BaseConocimientoRepository extends MongoRepository<BaseConocimiento, String> {
}
