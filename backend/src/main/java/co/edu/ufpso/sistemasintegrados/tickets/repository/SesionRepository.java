package co.edu.ufpso.sistemasintegrados.tickets.repository;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Sesion;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SesionRepository extends MongoRepository<Sesion, String> {
    Optional<Sesion> findByToken(String token);
    Optional<Sesion> findByRefreshToken(String refreshToken);
}
