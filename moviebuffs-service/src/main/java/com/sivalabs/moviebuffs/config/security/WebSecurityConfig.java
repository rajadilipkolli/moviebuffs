package com.sivalabs.moviebuffs.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true, proxyTargetClass = true)
public class WebSecurityConfig {

	/**
	 * Expose AuthenticationManager as a Bean
	 */
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	/**
	 * API security configuration with JWT token authentication
	 */
	@Configuration
	@Order(1)
	public static class ApiSecurityConfig {

		private final UserDetailsService userDetailsService;

		private final TokenHelper tokenHelper;

		public ApiSecurityConfig(UserDetailsService userDetailsService, TokenHelper tokenHelper) {
			this.userDetailsService = userDetailsService;
			this.tokenHelper = tokenHelper;
		}

		@Bean
		public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
			http.securityMatchers(matchers -> matchers.requestMatchers("/api/**"))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> authorize.requestMatchers("/api/auth/**")
					.permitAll()
					.requestMatchers(HttpMethod.POST, "/api/users/change-password")
					.authenticated()
					.requestMatchers("/api/users/**")
					.permitAll()
					.requestMatchers(HttpMethod.GET, "/api/genres/**", "/api/movies/**")
					.permitAll()
					.anyRequest()
					.authenticated())
				.addFilterBefore(new TokenAuthenticationFilter(tokenHelper, userDetailsService),
						BasicAuthenticationFilter.class)
				.csrf(AbstractHttpConfigurer::disable)
				.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

			return http.build();
		}

	}

	/**
	 * Form-based login security configuration
	 */
	@Configuration
	@Order(2)
	public static class FormLoginSecurityConfig {

		@Bean
		public SecurityFilterChain formLoginFilterChain(HttpSecurity http) throws Exception {
			http.authorizeHttpRequests(authorize -> authorize
				// Static resources
				.requestMatchers("/resources/**", "/webjars/**")
				.permitAll()
				.requestMatchers("/static/**", "/js/**", "/css/**", "/images/**", "/favicon.ico")
				.permitAll()
				// Public pages
				.requestMatchers("/", "/registration", "/forgot-password", "/reset-password")
				.permitAll()
				// H2 console
				.requestMatchers("/h2-console/**")
				.permitAll()
				// Login page
				.requestMatchers("/login")
				.permitAll()
				// For tests
				.requestMatchers(HttpMethod.POST, "/api/**")
				.permitAll()
				// Enable this for production if you want to secure all other endpoints
				// .anyRequest().authenticated()
				.anyRequest()
				.permitAll())
				.formLogin(
						form -> form.loginPage("/login").defaultSuccessUrl("/").failureUrl("/login?error").permitAll())
				.logout(logout -> logout.logoutUrl("/logout").permitAll())
				.csrf(AbstractHttpConfigurer::disable)
				.headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

			return http.build();
		}

	}

}
