package co.edu.ufpso.sistemasintegrados.tickets.repository;

import co.edu.ufpso.sistemasintegrados.tickets.domain.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);
}
