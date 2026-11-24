package co.tickets.domain;

import co.tickets.domain.enums.EstadoMembresia;
import co.tickets.domain.enums.ModuloErp;
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
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("membresias")
public class Membresia {

    @Id
    private String id;

    @Field(value = "clienteId", targetType = FieldType.OBJECT_ID)
    private String clienteId;

    private String plan;

    @Builder.Default
    private List<ModuloErp> modulosContratados = new ArrayList<>();

    @Builder.Default
    private EstadoMembresia estado = EstadoMembresia.activa;

    private LocalDate fechaInicio;
    private LocalDate fechaVencimiento;

    private BigDecimal precio;

    @Builder.Default
    private Boolean pagoAlDia = Boolean.FALSE;

    @CreatedDate
    private Instant fechaCreacion;

    @LastModifiedDate
    private Instant fechaActualizacion;
}
