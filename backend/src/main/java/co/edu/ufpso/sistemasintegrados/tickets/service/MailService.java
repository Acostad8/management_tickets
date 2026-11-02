package co.edu.ufpso.sistemasintegrados.tickets.service;

import co.edu.ufpso.sistemasintegrados.tickets.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;
    private final AppProperties props;

    public MailService(JavaMailSender mailSender, AppProperties props) {
        this.mailSender = mailSender;
        this.props = props;
    }

    public void sendPasswordReset(String toEmail, String nombre, String resetUrl, int expirationMin) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(props.mail().from());
            msg.setTo(toEmail);
            msg.setSubject("Recuperación de contraseña - Sistemas Integrados S.A.");
            msg.setText(buildResetBody(nombre, resetUrl, expirationMin));
            mailSender.send(msg);
            log.info("Correo de recuperación enviado a {}", toEmail);
        } catch (Exception ex) {
            log.error("Error enviando correo de recuperación a {}: {}", toEmail, ex.getMessage());
        }
    }

    private String buildResetBody(String nombre, String resetUrl, int expirationMin) {
        return """
                Hola %s,

                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
                Haz clic en el siguiente enlace para continuar (válido por %d minutos):

                %s

                Si no solicitaste este cambio, puedes ignorar este correo.

                —
                Sistemas Integrados S.A.
                """.formatted(nombre != null ? nombre : "", expirationMin, resetUrl);
    }
}
