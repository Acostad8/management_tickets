package co.edu.ufpso.sistemasintegrados.tickets;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class TicketsApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(TicketsApiApplication.class, args);
    }
}
