package co.edu.ufpso.sistemasintegrados.tickets.repository;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}
