package co.edu.ufpso.sistemasintegrados.tickets.dto.auth;

import co.edu.ufpso.sistemasintegrados.tickets.common.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank(message = "El token es obligatorio")
        String token,

        @ValidPassword
        String newPassword,

        @NotBlank(message = "La confirmación es obligatoria")
        String confirmPassword) {
}
