package co.edu.ufpso.sistemasintegrados.tickets.domain;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModalidadCapacitacion;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
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
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("capacitaciones")
public class Capacitacion {

    @Id
    private String id;

    private String titulo;
    private String descripcion;
    private ModuloErp modulo;
    private ModalidadCapacitacion modalidad;

    private Instant fechaProgramada;
    private Integer duracionMinutos;

    @Field(value = "instructorId", targetType = FieldType.OBJECT_ID)
    private String instructorId;

    @Field(value = "clientesInvitados", targetType = FieldType.OBJECT_ID)
    @Builder.Default
    private List<String> clientesInvitados = new ArrayList<>();

    private Integer cupoMaximo;

    @Builder.Default
    private EstadoCapacitacion estado = EstadoCapacitacion.programada;

    @CreatedDate
    private Instant fechaCreacion;

    @LastModifiedDate
    private Instant fechaActualizacion;
}
