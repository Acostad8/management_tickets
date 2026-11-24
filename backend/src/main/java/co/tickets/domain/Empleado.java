package co.tickets.domain;

import co.tickets.domain.enums.AreaEmpleado;
import co.tickets.domain.enums.EstadoEmpleado;
import co.tickets.domain.enums.ModuloErp;
import co.tickets.domain.enums.NivelEmpleado;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("empleados")
public class Empleado {

    @Id
    private String id;

    private String codigoEmpleado;

    @Field(value = "usuarioId", targetType = FieldType.OBJECT_ID)
    private String usuarioId;

    private String nombre;
    private String apellido;
    private String email;
    private String telefono;

    private AreaEmpleado area;
    private String cargo;

    @Builder.Default
    private List<ModuloErp> especialidad = new ArrayList<>();

    private NivelEmpleado nivel;

    @Builder.Default
    private EstadoEmpleado estado = EstadoEmpleado.activo;

    private LocalDate fechaIngreso;

    @CreatedDate
    private Instant fechaCreacion;

    @LastModifiedDate
    private Instant fechaActualizacion;
}
