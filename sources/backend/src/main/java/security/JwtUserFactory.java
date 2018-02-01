package security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import security.model.Authority;
import security.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public final class JwtUserFactory {

    private JwtUserFactory() {
    }

    public static JwtUser create(User user) {
        return new JwtUser(
                user.getId(),
                user.getUsername(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getPassword(),
                mapToGrantedAuthorities(user.getAuthorities()),
                user.getEnabled(),
                user.getLastPasswordResetDate()
        );
    }

    private static List<GrantedAuthority> mapToGrantedAuthorities(List<Authority> pAuthorities) {
       
    	List<GrantedAuthority> gAuthorities = new ArrayList<GrantedAuthority>();
    	
    	for ( Authority pAuthority : pAuthorities ) {
    		gAuthorities.add( new SimpleGrantedAuthority(pAuthority.getName().name()) );
    	}
    	
    	return gAuthorities;
    	
    	/*return authorities.stream()
                .map(authority -> new SimpleGrantedAuthority(authority.getName().name()))
                .collect(Collectors.toList());*/
    }
}
