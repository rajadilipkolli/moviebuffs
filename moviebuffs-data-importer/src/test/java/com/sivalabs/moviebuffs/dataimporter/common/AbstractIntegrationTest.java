package com.sivalabs.moviebuffs.dataimporter.common;

import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT, classes = {PostGreSQLContainer.class})
@AutoConfigureMockMvc
@SpringBatchTest
public abstract class AbstractIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

}
