package co.tickets.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("sesiones")
public class Sesion {

    @Id
    private String id;

    @Indexed
    @Field(targetType = FieldType.OBJECT_ID)
    private String usuarioId;

    @Indexed(unique = true)
    private String token;

    private String refreshToken;
    private String ip;
    private String userAgent;

    @Builder.Default
    private Boolean activa = true;

    private Instant fechaInicio;

    @Indexed(expireAfterSeconds = 0)
    private Instant fechaExpiracion;

    private Instant fechaCierre;
}
