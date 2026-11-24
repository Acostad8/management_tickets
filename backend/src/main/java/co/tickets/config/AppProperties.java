package co.tickets.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        Jwt jwt,
        Mail mail,
        PasswordReset passwordReset,
        Auth auth,
        Cors cors) {

    public record Jwt(String secret, int accessExpirationMin, int refreshExpirationDays) { }
    public record Mail(String from) { }
    public record PasswordReset(int tokenExpirationMin, String url) { }
    public record Auth(int maxFailedAttempts) { }
    public record Cors(String allowedOrigins) { }
}
