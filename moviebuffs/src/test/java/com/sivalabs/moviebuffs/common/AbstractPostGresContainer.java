package com.sivalabs.moviebuffs.common;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;

public abstract class AbstractPostGresContainer {

	@Container
	protected static final PostgreSQLContainer<?> sqlContainer = new PostgreSQLContainer<>("postgres:latest")
			.withDatabaseName("integration-tests-db").withUsername("username").withPassword("password");

	static {
		sqlContainer.start();
	}

	@DynamicPropertySource
	static void addApplicationProperties(DynamicPropertyRegistry propertyRegistry) {
		propertyRegistry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
		propertyRegistry.add("spring.datasource.username", sqlContainer::getUsername);
		propertyRegistry.add("spring.datasource.password", sqlContainer::getPassword);
	}

}
