package co.edu.ufpso.sistemasintegrados.tickets.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("empleado_counters")
public class EmpleadoCounter {

    @Id
    private String id;

    private String scope;
    private Long seq;
}
