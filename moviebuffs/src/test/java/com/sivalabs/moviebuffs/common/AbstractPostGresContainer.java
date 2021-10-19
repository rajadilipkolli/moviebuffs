package com.sivalabs.moviebuffs.common;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;

public class AbstractPostGresContainer {

	@Container
	protected static final PostgreSQLContainer<?> POSTGRE_SQL_CONTAINER = new PostgreSQLContainer<>("postgres:latest")
			.withDatabaseName("integration-tests-db").withUsername("username").withPassword("password");

	static {
		POSTGRE_SQL_CONTAINER.start();
	}

	@DynamicPropertySource
	static void setPostgreSqlContainer(DynamicPropertyRegistry propertyRegistry) {
		propertyRegistry.add("spring.datasource.url", POSTGRE_SQL_CONTAINER::getJdbcUrl);
		propertyRegistry.add("spring.datasource.username", POSTGRE_SQL_CONTAINER::getUsername);
		propertyRegistry.add("spring.datasource.password", POSTGRE_SQL_CONTAINER::getPassword);
	}

}
