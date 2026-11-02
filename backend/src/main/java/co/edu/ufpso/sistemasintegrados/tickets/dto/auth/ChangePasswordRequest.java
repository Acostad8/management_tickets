package co.edu.ufpso.sistemasintegrados.tickets.dto.auth;

import co.edu.ufpso.sistemasintegrados.tickets.common.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
        @NotBlank(message = "La contraseña actual es obligatoria")
        String currentPassword,

        @ValidPassword
        String newPassword,

        @NotBlank(message = "La confirmación es obligatoria")
        String confirmPassword) {
}
