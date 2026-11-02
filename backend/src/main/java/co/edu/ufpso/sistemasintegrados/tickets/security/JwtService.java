package co.edu.ufpso.sistemasintegrados.tickets.security;

import co.edu.ufpso.sistemasintegrados.tickets.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey key;
    private final Duration accessDuration;
    private final Duration refreshDuration;

    public JwtService(AppProperties props) {
        byte[] secretBytes = props.jwt().secret().getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET debe tener al menos 32 bytes (256 bits).");
        }
        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.accessDuration = Duration.ofMinutes(props.jwt().accessExpirationMin());
        this.refreshDuration = Duration.ofDays(props.jwt().refreshExpirationDays());
    }

    public String generateAccessToken(String usuarioId, String email, List<String> roles, List<String> permisos) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(usuarioId)
                .claim("email", email)
                .claim("roles", roles)
                .claim("permisos", permisos)
                .claim("type", "access")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessDuration)))
                .signWith(key)
                .compact();
    }

    public String generateRefreshToken(String usuarioId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(usuarioId)
                .claim("type", "refresh")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(refreshDuration)))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Instant extractExpiration(String token) {
        return parse(token).getExpiration().toInstant();
    }

    public Duration getAccessDuration() {
        return accessDuration;
    }

    public Duration getRefreshDuration() {
        return refreshDuration;
    }
}
