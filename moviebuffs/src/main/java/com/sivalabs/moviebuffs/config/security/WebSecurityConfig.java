package com.sivalabs.moviebuffs.config.security;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true, proxyTargetClass = true)
public class WebSecurityConfig {

	@Bean
    public AuthenticationManager customAuthenticationManager(UserDetailsService userDetailsService, PasswordEncoder encoder) {
        return authentication -> {
            String username = authentication.getPrincipal() + "";
            String password = authentication.getCredentials() + "";
            
            UserDetails user = userDetailsService.loadUserByUsername(username);
            
            if (!encoder.matches(password, user.getPassword())) {
                throw new BadCredentialsException("Bad credentials");
            }
            
            if (!user.isEnabled()) {
                throw new DisabledException("User account is not active");
            }
            
            return new UsernamePasswordAuthenticationToken(username, null, user.getAuthorities());
        };
    }

	@Configuration
	@Order(1)
	@RequiredArgsConstructor
	public static class ApiWebSecurityConfigurationAdapter {

		private final UserDetailsService userDetailsService;

		private final TokenHelper tokenHelper;

		private final AuthenticationManager customAuthenticationManager;

		@Bean
    	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
			http.antMatcher("/api/**")
					.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
					.authorizeRequests().antMatchers("/api/auth/**").permitAll()
					.antMatchers(HttpMethod.POST, "/api/users/change-password").authenticated()
					.antMatchers("/api/users/**").permitAll()
					// .antMatchers(HttpMethod.POST,"/users").hasAnyRole("USER", "ADMIN")
					// .anyRequest().authenticated()
				.and()
					.addFilterBefore(new TokenAuthenticationFilter(tokenHelper, userDetailsService),
							BasicAuthenticationFilter.class);

			http.authenticationManager(customAuthenticationManager);

			http.csrf()
					// .ignoringAntMatchers("/h2-console/**")//don't apply CSRF protection
					// to /h2-console
					.disable().headers().frameOptions().sameOrigin() // allow use of frame
																		// to same origin
																		// urls
			;
			return http.build();
		}

	}

	@Configuration
	public static class FormLoginWebSecurityConfigurerAdapter {

		@Bean
    	public WebSecurityCustomizer webSecurityCustomizer() {
			return (web) -> web.ignoring().antMatchers("/static/**", "/js/**", "/css/**", "/images/**", "/favicon.ico",
					"/h2-console/**");
		}

		@Bean
    	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
			http.csrf().disable().authorizeRequests().antMatchers("/resources/**", "/webjars/**").permitAll()
					.antMatchers("/registration", "/forgot-password", "/reset-password").permitAll()
					.antMatchers("/h2-console/**").permitAll()
					// .anyRequest().authenticated()
					.and().formLogin().loginPage("/login").defaultSuccessUrl("/").failureUrl("/login?error").permitAll()
					.and().logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).permitAll();
			
			return http.build();
		}

	}

}
