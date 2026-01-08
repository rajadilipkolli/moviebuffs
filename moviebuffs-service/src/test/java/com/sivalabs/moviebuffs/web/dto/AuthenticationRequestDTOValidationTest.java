package com.sivalabs.moviebuffs.web.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;

class AuthenticationRequestDTOValidationTest {

	private static ValidatorFactory validatorFactory;

	private static Validator validator;

	@BeforeAll
	static void init() {
		validatorFactory = Validation.buildDefaultValidatorFactory();
		validator = validatorFactory.getValidator();
	}

	@AfterAll
	static void close() {
		validatorFactory.close();
	}

	@Test
	void should_report_constraint_violations_for_blank_username() {
		AuthenticationRequestDTO dto = new AuthenticationRequestDTO("", "password");
		Set<ConstraintViolation<AuthenticationRequestDTO>> violations = validator.validate(dto);
		assertFalse(violations.isEmpty());
	}

	@Test
	void should_report_constraint_violations_for_blank_password() {
		AuthenticationRequestDTO dto = new AuthenticationRequestDTO("user@example.com", "");
		Set<ConstraintViolation<AuthenticationRequestDTO>> violations = validator.validate(dto);
		assertFalse(violations.isEmpty());
	}

	@Test
	void should_report_constraint_violations_for_null_values() {
		AuthenticationRequestDTO dto = new AuthenticationRequestDTO(null, null);
		Set<ConstraintViolation<AuthenticationRequestDTO>> violations = validator.validate(dto);
		assertFalse(violations.isEmpty());
	}

}
