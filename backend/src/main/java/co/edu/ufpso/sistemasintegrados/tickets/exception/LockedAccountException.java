package co.edu.ufpso.sistemasintegrados.tickets.exception;

import org.springframework.http.HttpStatus;

public class LockedAccountException extends ApiException {
    public LockedAccountException() {
        super(HttpStatus.LOCKED, "Cuenta bloqueada por múltiples intentos fallidos. Contacte al administrador.");
    }

    public LockedAccountException(String message) {
        super(HttpStatus.LOCKED, message);
    }
}
