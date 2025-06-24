package com.sivalabs.moviebuffs.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, proxyTargetClass = true)
@RequiredArgsConstructor
public class WebSecurityConfig {

	private final UserDetailsService userDetailsService;

	private final PasswordEncoder passwordEncoder;

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
	}

	@Configuration
	@Order(1)
	@RequiredArgsConstructor
	public static class ApiWebSecurityConfiguration {

		private final UserDetailsService userDetailsService;

		private final PasswordEncoder passwordEncoder;

		private final TokenHelper tokenHelper;

		@Bean
		public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
			AuthenticationManagerBuilder authenticationManagerBuilder = http
				.getSharedObject(AuthenticationManagerBuilder.class);
			authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
			return authenticationManagerBuilder.build();
		}

		@Bean
		public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
			http.securityMatcher("/api/**")
				.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(requests -> requests
					.requestMatchers("/api/auth/**", "/api/users/**", "/swagger-ui.html", "/swagger-ui/**",
							"/v3/api-docs/**")
					.permitAll()
					.requestMatchers(HttpMethod.POST, "/api/users/change-password")
					.authenticated()
					// .antMatchers(HttpMethod.POST,"/users").hasAnyRole("USER", "ADMIN")
					.anyRequest()
					.authenticated())
				.addFilterBefore(new TokenAuthenticationFilter(tokenHelper, userDetailsService),
						BasicAuthenticationFilter.class);

			http.csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**")
				// don't apply CSRF protection to /h2-console
				.disable()).headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));
			// allow use of frame to same origin urls
			return http.build();
		}

	}

	@Configuration
	@Order(2)
	public static class FormLoginWebSecurityConfiguration {

		@Bean
		public SecurityFilterChain formFilterChain(HttpSecurity http) throws Exception {
			http.securityMatcher("/**")
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(requests -> requests
					.requestMatchers("/", "/resources/**", "/webjars/**", "/registration", "/forgot-password",
							"/reset-password", "/static/**", "/js/**", "/css/**", "/images/**", "/favicon.ico",
							"/h2-console/**")
					.permitAll())
				.formLogin(login -> login.loginPage("/login")
					.defaultSuccessUrl("/")
					.failureUrl("/login?error")
					.permitAll())
				.logout(logout -> logout.logoutRequestMatcher(new AntPathRequestMatcher("/logout")).permitAll());
			return http.build();
		}

	}

}
