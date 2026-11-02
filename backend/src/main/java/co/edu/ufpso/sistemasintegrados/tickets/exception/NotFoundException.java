package co.edu.ufpso.sistemasintegrados.tickets.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends ApiException {
    public NotFoundException(String resource, Object id) {
        super(HttpStatus.NOT_FOUND, "%s no encontrado con id=%s".formatted(resource, id));
    }

    public NotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
