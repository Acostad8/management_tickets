package co.edu.ufpso.sistemasintegrados.tickets.repository;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Pago;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PagoRepository extends MongoRepository<Pago, String> {
    List<Pago> findByClienteIdOrderByFechaPagoDesc(String clienteId);
    List<Pago> findByMembresiaIdOrderByFechaPagoDesc(String membresiaId);
}
