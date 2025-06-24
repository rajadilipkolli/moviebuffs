package com.sivalabs.moviebuffs.dataimporter;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
@TestPropertySource(properties = "spring.batch.initialize-schema=always")
class MoviebuffsDataImporterApplicationTests {

    @Container
    protected static final PostgreSQLContainer<?> sqlContainer =
            new PostgreSQLContainer<>("postgres:17-alpine")
                    .withDatabaseName("integration-tests-db")
                    .withUsername("username")
                    .withPassword("password");

    @DynamicPropertySource
    static void setSqlContainer(DynamicPropertyRegistry propertyRegistry) {
        propertyRegistry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        propertyRegistry.add("spring.datasource.username", sqlContainer::getUsername);
        propertyRegistry.add("spring.datasource.password", sqlContainer::getPassword);
    }
    @Test
    void contextLoads() {
        assertThat(sqlContainer.isRunning()).isTrue();
    }

}
