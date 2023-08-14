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
			http
				// .antMatcher("/api/**")
				.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and()
				.authorizeHttpRequests()
				.requestMatchers("/api/auth/**", "/api/users/**", "/swagger-ui.html", "/swagger-ui/**",
						"/v3/api-docs/**")
				.permitAll()
				.requestMatchers(HttpMethod.POST, "/api/users/change-password")
				.authenticated()
				// .antMatchers(HttpMethod.POST,"/users").hasAnyRole("USER", "ADMIN")
				.anyRequest()
				.authenticated()
				.and()
				.addFilterBefore(new TokenAuthenticationFilter(tokenHelper, userDetailsService),
						BasicAuthenticationFilter.class);

			http.csrf()
				.ignoringRequestMatchers("/h2-console/**")
				// don't apply CSRF protection to /h2-console
				.disable()
				.headers()
				.frameOptions()
				.sameOrigin();
			// allow use of frame to same origin urls
			return http.build();
		}

	}

	@Configuration
	public static class FormLoginWebSecurityConfiguration {

		@Bean
		public SecurityFilterChain formFilterChain(HttpSecurity http) throws Exception {
			http.csrf()
				.disable()
				.authorizeHttpRequests()
				.requestMatchers("/resources/**", "/webjars/**", "/registration", "/forgot-password", "/reset-password",
						"/static/**", "/js/**", "/css/**", "/images/**", "/favicon.ico", "/h2-console/**")
				.permitAll()
				// .anyRequest().authenticated()
				.and()
				.formLogin()
				.loginPage("/login")
				.defaultSuccessUrl("/")
				.failureUrl("/login?error")
				.permitAll()
				.and()
				.logout()
				.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
				.permitAll();
			return http.build();
		}

	}

}
