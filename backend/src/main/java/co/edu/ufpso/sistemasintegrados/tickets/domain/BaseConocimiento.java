package co.edu.ufpso.sistemasintegrados.tickets.domain;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoArticulo;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloKb;
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
@Document("base_conocimiento")
public class BaseConocimiento {

    @Id
    private String id;

    private String titulo;
    private String contenido;
    private ModuloKb modulo;

    @Builder.Default
    private List<String> etiquetas = new ArrayList<>();

    @Field(targetType = FieldType.OBJECT_ID)
    private String ticketOrigenId;

    @Field(targetType = FieldType.OBJECT_ID)
    private String autorId;

    @Builder.Default
    private Integer vistas = 0;

    @Builder.Default
    private Integer utilidad = 0;

    @Builder.Default
    private EstadoArticulo estado = EstadoArticulo.borrador;

    @CreatedDate
    private Instant fechaCreacion;

    @LastModifiedDate
    private Instant fechaActualizacion;
}
