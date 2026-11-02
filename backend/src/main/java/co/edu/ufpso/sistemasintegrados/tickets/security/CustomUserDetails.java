package co.edu.ufpso.sistemasintegrados.tickets.security;

import co.edu.ufpso.sistemasintegrados.tickets.domain.Usuario;
import co.edu.ufpso.sistemasintegrados.tickets.domain.enums.EstadoUsuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final Usuario usuario;
    private final List<String> permisos;

    public CustomUserDetails(Usuario usuario, List<String> permisos) {
        this.usuario = usuario;
        this.permisos = permisos;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public String getUsuarioId() {
        return usuario.getId();
    }

    public List<String> getPermisos() {
        return permisos;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (String permiso : permisos) {
            authorities.add(new SimpleGrantedAuthority(permiso));
        }
        for (String rol : usuario.getRoles()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + rol));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return usuario.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return usuario.getEstado() != EstadoUsuario.bloqueado;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return usuario.getEstado() == EstadoUsuario.activo;
    }
}
