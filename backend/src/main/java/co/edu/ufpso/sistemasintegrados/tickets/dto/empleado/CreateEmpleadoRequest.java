package co.edu.ufpso.sistemasintegrados.tickets.dto.empleado;

import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.AreaEmpleado;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.ModuloErp;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.NivelEmpleado;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record CreateEmpleadoRequest(
        @NotBlank String usuarioId,
        @NotBlank @Size(max = 60) String nombre,
        @Size(max = 60) String apellido,
        @Email @Size(max = 120) String email,
        @Size(max = 30) String telefono,
        @NotNull AreaEmpleado area,
        @Size(max = 80) String cargo,
        List<ModuloErp> especialidad,
        NivelEmpleado nivel,
        LocalDate fechaIngreso) {
}
