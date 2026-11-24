package co.tickets.service;

import co.tickets.config.AppProperties;
import co.tickets.domain.PasswordResetToken;
import co.tickets.domain.Sesion;
import co.tickets.domain.Usuario;
import co.tickets.domain.enums.EstadoUsuario;
import co.tickets.dto.auth.*;
import co.tickets.exception.BusinessException;
import co.tickets.exception.LockedAccountException;
import co.tickets.exception.NotFoundException;
import co.tickets.exception.UnauthorizedException;
import co.tickets.repository.PasswordResetTokenRepository;
import co.tickets.repository.RolRepository;
import co.tickets.repository.SesionRepository;
import co.tickets.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import co.tickets.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final SesionRepository sesionRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;
    private final AppProperties props;

    public AuthService(UsuarioRepository usuarioRepository,
                       RolRepository rolRepository,
                       SesionRepository sesionRepository,
                       PasswordResetTokenRepository resetTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       MailService mailService,
                       AppProperties props) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.sesionRepository = sesionRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.props = props;
    }

    public LoginResponse login(LoginRequest req, HttpServletRequest httpReq) {
        Usuario usuario = usuarioRepository.findByEmail(req.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (usuario.getEstado() == EstadoUsuario.bloqueado) {
            throw new LockedAccountException();
        }
        if (usuario.getEstado() == EstadoUsuario.inactivo) {
            throw new UnauthorizedException("La cuenta está inactiva");
        }

        if (!passwordEncoder.matches(req.password(), usuario.getPasswordHash())) {
            registerFailedAttempt(usuario);
            throw new UnauthorizedException("Credenciales inválidas");
        }

        usuario.setIntentosFallidos(0);
        usuario.setUltimoAcceso(Instant.now());
        usuarioRepository.save(usuario);

        List<String> permisos = resolvePermisos(usuario.getRoles());
        String access = jwtService.generateAccessToken(usuario.getId(), usuario.getEmail(), usuario.getRoles(), permisos);
        String refresh = jwtService.generateRefreshToken(usuario.getId());

        Instant exp = jwtService.extractExpiration(access);
        Sesion sesion = Sesion.builder()
                .usuarioId(usuario.getId())
                .token(access)
                .refreshToken(refresh)
                .ip(resolveClientIp(httpReq))
                .userAgent(httpReq.getHeader("User-Agent"))
                .activa(true)
                .fechaInicio(Instant.now())
                .fechaExpiracion(exp)
                .build();
        sesionRepository.save(sesion);

        return LoginResponse.of(access, refresh, jwtService.getAccessDuration().getSeconds(),
                UserInfoDto.from(usuario, permisos));
    }

    public LoginResponse refresh(RefreshRequest req, HttpServletRequest httpReq) {
        Claims claims;
        try {
            claims = jwtService.parse(req.refreshToken());
        } catch (JwtException ex) {
            throw new UnauthorizedException("Refresh token inválido o expirado");
        }

        if (!"refresh".equals(claims.get("type", String.class))) {
            throw new UnauthorizedException("Token no es de tipo refresh");
        }

        Sesion sesion = sesionRepository.findByRefreshToken(req.refreshToken())
                .orElseThrow(() -> new UnauthorizedException("Sesión no encontrada"));

        if (!Boolean.TRUE.equals(sesion.getActiva())) {
            throw new UnauthorizedException("Sesión cerrada");
        }

        Usuario usuario = usuarioRepository.findById(claims.getSubject())
                .orElseThrow(() -> new UnauthorizedException("Usuario no encontrado"));

        if (usuario.getEstado() != EstadoUsuario.activo) {
            throw new UnauthorizedException("Usuario no activo");
        }

        sesion.setActiva(false);
        sesion.setFechaCierre(Instant.now());
        sesionRepository.save(sesion);

        List<String> permisos = resolvePermisos(usuario.getRoles());
        String newAccess = jwtService.generateAccessToken(usuario.getId(), usuario.getEmail(), usuario.getRoles(), permisos);
        String newRefresh = jwtService.generateRefreshToken(usuario.getId());

        Sesion nueva = Sesion.builder()
                .usuarioId(usuario.getId())
                .token(newAccess)
                .refreshToken(newRefresh)
                .ip(resolveClientIp(httpReq))
                .userAgent(httpReq.getHeader("User-Agent"))
                .activa(true)
                .fechaInicio(Instant.now())
                .fechaExpiracion(jwtService.extractExpiration(newAccess))
                .build();
        sesionRepository.save(nueva);

        return LoginResponse.of(newAccess, newRefresh, jwtService.getAccessDuration().getSeconds(),
                UserInfoDto.from(usuario, permisos));
    }

    public void logout(String accessToken) {
        sesionRepository.findByToken(accessToken).ifPresent(s -> {
            s.setActiva(false);
            s.setFechaCierre(Instant.now());
            sesionRepository.save(s);
        });
    }

    public void forgotPassword(String email) {
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            String token = UUID.randomUUID().toString();
            Instant now = Instant.now();
            Instant exp = now.plusSeconds(props.passwordReset().tokenExpirationMin() * 60L);

            PasswordResetToken reset = PasswordResetToken.builder()
                    .token(token)
                    .usuarioId(usuario.getId())
                    .fechaCreacion(now)
                    .fechaExpiracion(exp)
                    .utilizado(false)
                    .build();
            resetTokenRepository.save(reset);

            String url = props.passwordReset().url() + "?token=" + token;
            mailService.sendPasswordReset(usuario.getEmail(), usuario.getNombre(), url,
                    props.passwordReset().tokenExpirationMin());
        });
    }

    public void resetPassword(ResetPasswordRequest req) {
        if (!req.newPassword().equals(req.confirmPassword())) {
            throw new BusinessException("La contraseña y su confirmación no coinciden");
        }

        PasswordResetToken reset = resetTokenRepository.findByToken(req.token())
                .orElseThrow(() -> new BusinessException("Token inválido"));

        if (Boolean.TRUE.equals(reset.getUtilizado())) {
            throw new BusinessException("El token ya fue utilizado");
        }
        if (reset.getFechaExpiracion().isBefore(Instant.now())) {
            throw new BusinessException("El token expiró");
        }

        Usuario usuario = usuarioRepository.findById(reset.getUsuarioId())
                .orElseThrow(() -> new NotFoundException("Usuario", reset.getUsuarioId()));

        usuario.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        usuario.setIntentosFallidos(0);
        if (usuario.getEstado() == EstadoUsuario.bloqueado) {
            usuario.setEstado(EstadoUsuario.activo);
        }
        usuarioRepository.save(usuario);

        reset.setUtilizado(true);
        reset.setFechaUso(Instant.now());
        resetTokenRepository.save(reset);
    }

    public void changePassword(String usuarioId, ChangePasswordRequest req) {
        if (!req.newPassword().equals(req.confirmPassword())) {
            throw new BusinessException("La contraseña y su confirmación no coinciden");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new NotFoundException("Usuario", usuarioId));

        if (!passwordEncoder.matches(req.currentPassword(), usuario.getPasswordHash())) {
            throw new BusinessException("La contraseña actual no es correcta");
        }

        usuario.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        usuarioRepository.save(usuario);
    }

    private void registerFailedAttempt(Usuario usuario) {
        int intentos = (usuario.getIntentosFallidos() == null ? 0 : usuario.getIntentosFallidos()) + 1;
        usuario.setIntentosFallidos(intentos);
        if (intentos >= props.auth().maxFailedAttempts()) {
            usuario.setEstado(EstadoUsuario.bloqueado);
            log.warn("Usuario {} bloqueado por {} intentos fallidos", usuario.getEmail(), intentos);
        }
        usuarioRepository.save(usuario);
    }

    private List<String> resolvePermisos(List<String> rolCodigos) {
        if (rolCodigos == null || rolCodigos.isEmpty()) {
            return List.of();
        }
        return rolRepository.findByCodigoIn(rolCodigos).stream()
                .filter(r -> Boolean.TRUE.equals(r.getActivo()))
                .flatMap(r -> r.getPermisos().stream())
                .distinct()
                .toList();
    }

    private String resolveClientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }
}
