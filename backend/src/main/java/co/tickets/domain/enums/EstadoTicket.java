package co.tickets.domain.enums;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

public enum EstadoTicket {
    nuevo,
    en_proceso,
    en_espera,
    resuelto,
    cerrado;

    private static final Map<EstadoTicket, Set<EstadoTicket>> TRANSITIONS = Map.of(
            nuevo,      EnumSet.of(en_proceso, en_espera, resuelto, cerrado),
            en_proceso, EnumSet.of(en_espera, resuelto, cerrado),
            en_espera,  EnumSet.of(en_proceso, resuelto, cerrado),
            resuelto,   EnumSet.of(cerrado, en_proceso),
            cerrado,    EnumSet.of(en_proceso)
    );

    public boolean canTransitionTo(EstadoTicket target) {
        return TRANSITIONS.getOrDefault(this, EnumSet.noneOf(EstadoTicket.class)).contains(target);
    }
}
