package com.sivalabs.moviebuffs.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.MacAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class TokenHelper {

	private final SecurityConfigProperties securityConfigProperties;

	private final TimeProvider timeProvider;

	private static final String AUDIENCE_WEB = "web";

	private static final MacAlgorithm SIGNATURE_ALGORITHM = Jwts.SIG.HS256;

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
		Date a = timeProvider.now();
		try {
			final Claims claims = this.getAllClaimsFromToken(token);
			if (claims == null) {
				return null;
			}
			// claims.setIssuedAt(a);
			refreshedToken = Jwts.builder()
				.claims(claims)
				.expiration(generateExpirationDate())
				.signWith(getSecretKey(securityConfigProperties.getJwt().getSecret()), SIGNATURE_ALGORITHM)
				.compact();
		}
		catch (Exception e) {
			refreshedToken = null;
		}
		return refreshedToken;
	}

	public String generateToken(String username) {
		return Jwts.builder()
			.issuer(securityConfigProperties.getJwt().getIssuer())
			.subject(username)
			.audience()
			.add(AUDIENCE_WEB)
			.and()
			.issuedAt(timeProvider.now())
			.expiration(generateExpirationDate())
			.signWith(getSecretKey(Base64.getEncoder()
				.encodeToString(securityConfigProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8))),
					SIGNATURE_ALGORITHM)
			.compact();
	}

	private Claims getAllClaimsFromToken(String token) {
		Claims claims;
		try {
			SecretKey key = getSecretKey(securityConfigProperties.getJwt().getSecret());
			claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
		}
		catch (Exception e) {
			claims = null;
		}
		return claims;
	}

	private SecretKey getSecretKey(String key) {
		byte[] bytes = Decoders.BASE64.decode(key);
		return Keys.hmacShaKeyFor(bytes);
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

}
