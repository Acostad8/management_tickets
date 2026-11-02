package co.edu.ufpso.sistemasintegrados.tickets.controller;

import co.edu.ufpso.sistemasintegrados.tickets.dto.auth.*;
import co.edu.ufpso.sistemasintegrados.tickets.security.CustomUserDetails;
import co.edu.ufpso.sistemasintegrados.tickets.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(authService.login(req, http));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@Valid @RequestBody RefreshRequest req, HttpServletRequest http) {
        return ResponseEntity.ok(authService.refresh(req, http));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest http) {
        String header = http.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            authService.logout(header.substring(7));
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgot(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req.email());
        return ResponseEntity.accepted().body(Map.of(
                "message", "Si el correo está registrado, recibirá instrucciones para recuperar la contraseña."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> reset(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente."));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> change(@AuthenticationPrincipal CustomUserDetails principal,
                                                       @Valid @RequestBody ChangePasswordRequest req) {
        authService.changePassword(principal.getUsuarioId(), req);
        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente."));
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoDto> me(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(UserInfoDto.from(principal.getUsuario(), principal.getPermisos()));
    }
}
