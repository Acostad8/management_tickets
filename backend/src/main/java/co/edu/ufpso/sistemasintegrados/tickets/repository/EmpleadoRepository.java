package co.edu.ufpso.sistemasintegrados.tickets.repository;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Empleado;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EmpleadoRepository extends MongoRepository<Empleado, String> {
    Optional<Empleado> findByUsuarioId(String usuarioId);
    Optional<Empleado> findByCodigoEmpleado(String codigoEmpleado);
    boolean existsByUsuarioId(String usuarioId);
    boolean existsByCodigoEmpleado(String codigoEmpleado);
}
