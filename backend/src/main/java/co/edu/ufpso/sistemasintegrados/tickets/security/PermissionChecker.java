package co.edu.ufpso.sistemasintegrados.tickets.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("perms")
public class PermissionChecker {

    private static final String WILDCARD = "*";

    public boolean has(String required) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        return auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .anyMatch(a -> WILDCARD.equals(a) || required.equals(a));
    }

    public boolean hasAny(String... requireds) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        return auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .anyMatch(a -> {
                    if (WILDCARD.equals(a)) return true;
                    for (String req : requireds) {
                        if (req.equals(a)) return true;
                    }
                    return false;
                });
    }

    public boolean isSelf(String usuarioId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails cud)) {
            return false;
        }
        return cud.getUsuarioId().equals(usuarioId);
    }
}
