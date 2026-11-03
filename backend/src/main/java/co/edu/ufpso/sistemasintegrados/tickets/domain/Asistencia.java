package co.edu.ufpso.sistemasintegrados.tickets.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("asistencias")
public class Asistencia {

    @Id
    private String id;

    @Field(value = "capacitacionId", targetType = FieldType.OBJECT_ID)
    private String capacitacionId;

    @Field(value = "clienteId", targetType = FieldType.OBJECT_ID)
    private String clienteId;

    private String participanteNombre;
    private String participanteDocumento;
    private String participanteCargo;
    private String participanteEmail;

    @Field(value = "registradoPor", targetType = FieldType.OBJECT_ID)
    private String registradoPor;

    @CreatedDate
    private Instant fechaRegistro;
}
