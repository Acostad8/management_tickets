package co.tickets.dto.auth;

import co.tickets.common.validation.ValidPassword;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank(message = "El token es obligatorio")
        String token,

        @ValidPassword
        String newPassword,

        @NotBlank(message = "La confirmación es obligatoria")
        String confirmPassword) {
}
