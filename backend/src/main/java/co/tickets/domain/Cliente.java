package co.tickets.domain;

import co.tickets.domain.enums.EstadoCliente;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("clientes")
public class Cliente {

    @Id
    private String id;

    @Indexed(unique = true)
    private String nit;

    private String razonSocial;
    private String nombreContacto;
    private String emailContacto;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String pais;

    @Builder.Default
    private EstadoCliente estado = EstadoCliente.activo;

    @CreatedDate
    private Instant fechaCreacion;

    @LastModifiedDate
    private Instant fechaActualizacion;
}
