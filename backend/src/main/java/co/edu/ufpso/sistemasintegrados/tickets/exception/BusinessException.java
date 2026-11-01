package co.edu.ufpso.sistemasintegrados.tickets.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends ApiException {
    public BusinessException(String message) {
        super(HttpStatus.UNPROCESSABLE_ENTITY, message);
    }
}
