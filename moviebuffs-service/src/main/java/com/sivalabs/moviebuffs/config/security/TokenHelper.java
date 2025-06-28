package com.sivalabs.moviebuffs.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;

@Component
@RequiredArgsConstructor
public class TokenHelper {

	private final SecurityConfigProperties securityConfigProperties;

	private final TimeProvider timeProvider;

	private static final String AUDIENCE_WEB = "web";

	public String getUsernameFromToken(String token) {
		String username;
		try {
			final Claims claims = this.getAllClaimsFromToken(token);
			if (claims == null)
				return null;
			username = claims.getSubject();
		}
		catch (Exception e) {
			username = null;
		}
		return username;
	}

	public String refreshToken(String token) {
		String refreshedToken;
		Date now = timeProvider.now();
		try {
			final Claims claims = this.getAllClaimsFromToken(token);
			if (claims == null)
				return null;
			Map<String, Object> refreshedClaims = new HashMap<>(claims);
			refreshedClaims.put(Claims.ISSUED_AT, now);
			refreshedClaims.put(Claims.EXPIRATION, generateExpirationDate());
			refreshedToken = Jwts.builder().claims(refreshedClaims).signWith(getSigningKey()).compact();
		}
		catch (Exception e) {
			refreshedToken = null;
		}
		return refreshedToken;
	}

	public String generateToken(String username) {
		return Jwts.builder()
			.subject(username)
			.issuer(securityConfigProperties.getJwt().getIssuer())
			.issuedAt(timeProvider.now())
			.expiration(generateExpirationDate())
			.audience()
			.add(AUDIENCE_WEB)
			.and()
			.signWith(getSigningKey())
			.compact();
	}

	private Claims getAllClaimsFromToken(String token) {
		Claims claims;
		try {
			claims = Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
		}
		catch (Exception e) {
			claims = null;
		}
		return claims;
	}

	private Date generateExpirationDate() {
		return new Date(timeProvider.now().getTime() + securityConfigProperties.getJwt().getExpiresIn() * 1000);
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		final String username = getUsernameFromToken(token);
		return (username != null && username.equals(userDetails.getUsername()));
	}

	public String getToken(HttpServletRequest request) {
		String authHeader = getAuthHeaderFromHeader(request);
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			return authHeader.substring(7);
		}
		return null;
	}

	private String getAuthHeaderFromHeader(HttpServletRequest request) {
		return request.getHeader(securityConfigProperties.getJwt().getHeader());
	}

	private SecretKey getSigningKey() {
		byte[] keyBytes = securityConfigProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
		return Keys.hmacShaKeyFor(keyBytes);
	}

}
