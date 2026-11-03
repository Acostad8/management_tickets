package co.tickets.security;

import co.tickets.domain.Rol;
import co.tickets.domain.Usuario;
import co.tickets.repository.RolRepository;
import co.tickets.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
        return buildDetails(usuario);
    }

    public UserDetails loadUserById(String id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + id));
        return buildDetails(usuario);
    }

    private CustomUserDetails buildDetails(Usuario usuario) {
        List<String> permisos = resolvePermisos(usuario.getRoles());
        return new CustomUserDetails(usuario, permisos);
    }

    private List<String> resolvePermisos(List<String> rolCodigos) {
        if (rolCodigos == null || rolCodigos.isEmpty()) {
            return List.of();
        }
        return rolRepository.findByCodigoIn(rolCodigos).stream()
                .filter(r -> Boolean.TRUE.equals(r.getActivo()))
                .flatMap(r -> r.getPermisos().stream())
                .distinct()
                .toList();
    }
}
