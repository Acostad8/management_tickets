package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Cliente;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoCliente;
import co.edu.ufpso.sistemasintegrados.tickets.dto.cliente.ClienteResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.cliente.CreateClienteRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.cliente.UpdateClienteRequest;
import co.edu.ufpso.sistemasintegrados.tickets.exception.ConflictException;
import co.edu.ufpso.sistemasintegrados.tickets.exception.NotFoundException;
import co.edu.ufpso.sistemasintegrados.tickets.repository.ClienteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final MongoTemplate mongoTemplate;

    public ClienteService(ClienteRepository clienteRepository, MongoTemplate mongoTemplate) {
        this.clienteRepository = clienteRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public ClienteResponse create(CreateClienteRequest req) {
        if (clienteRepository.existsByNit(req.nit())) {
            throw new ConflictException("Ya existe un cliente con NIT: " + req.nit());
        }
        Cliente c = Cliente.builder()
                .nit(req.nit())
                .razonSocial(req.razonSocial())
                .nombreContacto(req.nombreContacto())
                .emailContacto(req.emailContacto())
                .telefono(req.telefono())
                .direccion(req.direccion())
                .ciudad(req.ciudad())
                .pais(req.pais())
                .estado(EstadoCliente.activo)
                .build();
        return ClienteResponse.from(clienteRepository.save(c));
    }

    public Page<ClienteResponse> list(String nit, String razonSocial, String ciudad,
                                      EstadoCliente estado, Pageable pageable) {
        Query query = new Query().with(pageable);
        if (nit != null && !nit.isBlank()) {
            query.addCriteria(Criteria.where("nit").regex(".*" + Pattern.quote(nit) + ".*", "i"));
        }
        if (razonSocial != null && !razonSocial.isBlank()) {
            query.addCriteria(Criteria.where("razonSocial").regex(".*" + Pattern.quote(razonSocial) + ".*", "i"));
        }
        if (ciudad != null && !ciudad.isBlank()) {
            query.addCriteria(Criteria.where("ciudad").regex(".*" + Pattern.quote(ciudad) + ".*", "i"));
        }
        if (estado != null) {
            query.addCriteria(Criteria.where("estado").is(estado.name()));
        }

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Cliente.class);
        List<Cliente> content = mongoTemplate.find(query, Cliente.class);
        List<ClienteResponse> dtos = content.stream().map(ClienteResponse::from).toList();
        return new PageImpl<>(dtos, pageable, total);
    }

    public ClienteResponse getById(String id) {
        return ClienteResponse.from(findOrThrow(id));
    }

    public ClienteResponse update(String id, UpdateClienteRequest req) {
        Cliente c = findOrThrow(id);
        c.setRazonSocial(req.razonSocial());
        c.setNombreContacto(req.nombreContacto());
        c.setEmailContacto(req.emailContacto());
        c.setTelefono(req.telefono());
        c.setDireccion(req.direccion());
        c.setCiudad(req.ciudad());
        c.setPais(req.pais());
        return ClienteResponse.from(clienteRepository.save(c));
    }

    public ClienteResponse changeEstado(String id, EstadoCliente nuevo) {
        Cliente c = findOrThrow(id);
        c.setEstado(nuevo);
        return ClienteResponse.from(clienteRepository.save(c));
    }

    private Cliente findOrThrow(String id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cliente", id));
    }
}
