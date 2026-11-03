package co.tickets.repository;

import co.tickets.domain.Rol;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RolRepository extends MongoRepository<Rol, String> {
    Optional<Rol> findByCodigo(String codigo);
    List<Rol> findByCodigoIn(List<String> codigos);
    boolean existsByCodigo(String codigo);
}
