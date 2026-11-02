package co.edu.ufpso.sistemasintegrados.tickets.domain;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoPago;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.MedioPago;
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

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("pagos")
public class Pago {

    @Id
    private String id;

    @Field(value = "clienteId", targetType = FieldType.OBJECT_ID)
    private String clienteId;

    @Field(value = "membresiaId", targetType = FieldType.OBJECT_ID)
    private String membresiaId;

    private BigDecimal valor;
    private LocalDate fechaPago;
    private MedioPago medioPago;
    private String referencia;
    private String observaciones;

    @Builder.Default
    private EstadoPago estado = EstadoPago.registrado;

    @Field(value = "registradoPor", targetType = FieldType.OBJECT_ID)
    private String registradoPor;

    @CreatedDate
    private Instant fechaCreacion;

    @LastModifiedDate
    private Instant fechaActualizacion;
}
