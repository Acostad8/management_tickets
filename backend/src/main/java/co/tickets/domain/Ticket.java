package co.tickets.domain;

import co.tickets.domain.embedded.HistorialEstado;
import co.tickets.domain.embedded.RespuestaTicket;
import co.tickets.domain.embedded.SolucionTicket;
import co.tickets.domain.enums.EstadoTicket;
import co.tickets.domain.enums.ModuloErp;
import co.tickets.domain.enums.PrioridadTicket;
import co.tickets.domain.enums.TipoTicket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("tickets")
public class Ticket {

    @Id
    private String id;

    private String codigo;
    private String titulo;
    private String descripcion;
    private TipoTicket tipo;

    @Field(targetType = FieldType.OBJECT_ID)
    private String clienteId;

    @Field(targetType = FieldType.OBJECT_ID)
    private String usuarioId;

    @Field(targetType = FieldType.OBJECT_ID)
    private String empleadoAsignadoId;

    private ModuloErp modulo;
    private PrioridadTicket prioridad;
    private EstadoTicket estado;

    @Builder.Default
    private Map<String, Object> detallesEspecificos = new LinkedHashMap<>();

    @Builder.Default
    private List<RespuestaTicket> respuestas = new ArrayList<>();

    private SolucionTicket solucion;

    @Builder.Default
    private List<HistorialEstado> historialEstados = new ArrayList<>();

    @CreatedDate
    private Instant fechaCreacion;

    @LastModifiedDate
    private Instant fechaActualizacion;

    private Instant fechaCierre;
}
