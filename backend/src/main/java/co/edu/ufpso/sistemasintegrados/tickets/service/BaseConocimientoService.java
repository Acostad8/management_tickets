package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.domain.BaseConocimiento;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoArticulo;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloKb;
import co.edu.ufpso.sistemasintegrados.tickets.dto.kb.ArticuloResponse;
import co.edu.ufpso.sistemasintegrados.tickets.dto.kb.CreateArticuloRequest;
import co.edu.ufpso.sistemasintegrados.tickets.dto.kb.UpdateArticuloRequest;
import co.edu.ufpso.sistemasintegrados.tickets.exception.NotFoundException;
import co.edu.ufpso.sistemasintegrados.tickets.repository.BaseConocimientoRepository;
import co.edu.ufpso.sistemasintegrados.tickets.security.CustomUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BaseConocimientoService {

    private final BaseConocimientoRepository repository;
    private final MongoTemplate mongoTemplate;

    public BaseConocimientoService(BaseConocimientoRepository repository, MongoTemplate mongoTemplate) {
        this.repository = repository;
        this.mongoTemplate = mongoTemplate;
    }

    public ArticuloResponse create(CreateArticuloRequest req, CustomUserDetails current) {
        BaseConocimiento a = BaseConocimiento.builder()
                .titulo(req.titulo())
                .contenido(req.contenido())
                .modulo(req.modulo())
                .etiquetas(req.etiquetas() != null ? req.etiquetas() : new ArrayList<>())
                .ticketOrigenId(req.ticketOrigenId())
                .autorId(current.getUsuarioId())
                .vistas(0)
                .utilidad(0)
                .estado(req.estado() != null ? req.estado() : EstadoArticulo.borrador)
                .build();
        return ArticuloResponse.from(repository.save(a));
    }

    public Page<ArticuloResponse> list(ModuloKb modulo, EstadoArticulo estado, String etiqueta,
                                       Pageable pageable, boolean onlyPublished) {
        Query query = new Query().with(pageable);
        if (onlyPublished) {
            query.addCriteria(Criteria.where("estado").is(EstadoArticulo.publicado.name()));
        } else if (estado != null) {
            query.addCriteria(Criteria.where("estado").is(estado.name()));
        }
        if (modulo != null) {
            query.addCriteria(Criteria.where("modulo").is(modulo.name()));
        }
        if (etiqueta != null && !etiqueta.isBlank()) {
            query.addCriteria(Criteria.where("etiquetas").is(etiqueta));
        }

        long total = countByQueryObject(query);
        List<BaseConocimiento> items = mongoTemplate.find(query, BaseConocimiento.class);
        List<ArticuloResponse> dtos = items.stream().map(ArticuloResponse::summary).toList();
        return new PageImpl<>(dtos, pageable, total);
    }

    public Page<ArticuloResponse> search(String q, ModuloKb modulo, Pageable pageable, boolean onlyPublished) {
        TextCriteria text = TextCriteria.forDefaultLanguage().matchingAny(q.split("\\s+"));
        TextQuery query = (TextQuery) TextQuery.queryText(text).sortByScore();
        query.with(pageable);

        if (onlyPublished) {
            query.addCriteria(Criteria.where("estado").is(EstadoArticulo.publicado.name()));
        }
        if (modulo != null) {
            query.addCriteria(Criteria.where("modulo").is(modulo.name()));
        }

        long total = countByQueryObject(query);
        List<BaseConocimiento> items = mongoTemplate.find(query, BaseConocimiento.class);
        List<ArticuloResponse> dtos = items.stream()
                .map(a -> ArticuloResponse.withScore(a, null))
                .toList();
        return new PageImpl<>(dtos, pageable, total);
    }

    private long countByQueryObject(Query query) {
        String collection = mongoTemplate.getCollectionName(BaseConocimiento.class);
        return mongoTemplate.getCollection(collection).countDocuments(query.getQueryObject());
    }

    public ArticuloResponse getById(String id, boolean incrementViews, boolean onlyPublished) {
        BaseConocimiento a = findOrThrow(id);
        if (onlyPublished && a.getEstado() != EstadoArticulo.publicado) {
            throw new NotFoundException("Articulo", id);
        }
        if (incrementViews && a.getEstado() == EstadoArticulo.publicado) {
            mongoTemplate.updateFirst(
                    Query.query(Criteria.where("_id").is(new org.bson.types.ObjectId(a.getId()))),
                    new Update().inc("vistas", 1),
                    BaseConocimiento.class);
            a.setVistas((a.getVistas() == null ? 0 : a.getVistas()) + 1);
        }
        return ArticuloResponse.from(a);
    }

    public ArticuloResponse update(String id, UpdateArticuloRequest req) {
        BaseConocimiento a = findOrThrow(id);
        a.setTitulo(req.titulo());
        a.setContenido(req.contenido());
        a.setModulo(req.modulo());
        if (req.etiquetas() != null) a.setEtiquetas(req.etiquetas());
        return ArticuloResponse.from(repository.save(a));
    }

    public ArticuloResponse cambiarEstado(String id, EstadoArticulo nuevo) {
        BaseConocimiento a = findOrThrow(id);
        a.setEstado(nuevo);
        return ArticuloResponse.from(repository.save(a));
    }

    public ArticuloResponse incrementarUtilidad(String id) {
        BaseConocimiento a = findOrThrow(id);
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("_id").is(new org.bson.types.ObjectId(a.getId()))),
                new Update().inc("utilidad", 1),
                BaseConocimiento.class);
        a.setUtilidad((a.getUtilidad() == null ? 0 : a.getUtilidad()) + 1);
        return ArticuloResponse.from(a);
    }

    public void delete(String id) {
        BaseConocimiento a = findOrThrow(id);
        repository.delete(a);
    }

    private BaseConocimiento findOrThrow(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Articulo", id));
    }
}
