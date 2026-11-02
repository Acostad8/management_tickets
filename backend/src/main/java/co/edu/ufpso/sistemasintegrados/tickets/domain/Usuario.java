package co.edu.ufpso.sistemasintegrados.tickets.domain;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoUsuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("usuarios")
public class Usuario {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;
    private String nombre;
    private String apellido;
    private String telefono;

    @Field("clienteId")
    private String clienteId;

    @Builder.Default
    private List<String> roles = new ArrayList<>();

    @Builder.Default
    private EstadoUsuario estado = EstadoUsuario.activo;

    private Instant ultimoAcceso;

    @Builder.Default
    private Integer intentosFallidos = 0;

    @CreatedDate
    private Instant fechaCreacion;

    @LastModifiedDate
    private Instant fechaActualizacion;
}
