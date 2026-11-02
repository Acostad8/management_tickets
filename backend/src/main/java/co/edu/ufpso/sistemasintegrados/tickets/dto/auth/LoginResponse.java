package co.edu.ufpso.sistemasintegrados.tickets.dto.auth;

public record LoginResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds,
        UserInfoDto user) {

    public static LoginResponse of(String access, String refresh, long expiresInSec, UserInfoDto user) {
        return new LoginResponse(access, refresh, "Bearer", expiresInSec, user);
    }
}
