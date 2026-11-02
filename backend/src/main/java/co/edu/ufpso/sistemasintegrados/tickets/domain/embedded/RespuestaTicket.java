package co.edu.ufpso.sistemasintegrados.tickets.domain.embedded;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RespuestaTicket {

    @Field(targetType = FieldType.OBJECT_ID)
    private String usuarioId;

    private String mensaje;
    private Instant fecha;

    @Builder.Default
    private Boolean esInterno = false;
}
