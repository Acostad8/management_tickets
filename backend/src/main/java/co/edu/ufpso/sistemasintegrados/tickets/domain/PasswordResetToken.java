package co.edu.ufpso.sistemasintegrados.tickets.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("password_reset_tokens")
public class PasswordResetToken {

    @Id
    private String id;

    @Indexed(unique = true)
    private String token;

    @Indexed
    private String usuarioId;

    private Instant fechaCreacion;

    @Indexed(expireAfterSeconds = 0)
    private Instant fechaExpiracion;

    @Builder.Default
    private Boolean utilizado = false;

    private Instant fechaUso;
}
