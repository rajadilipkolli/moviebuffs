package com.sivalabs.moviebuffs.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sivalabs.moviebuffs.MovieBuffsApplication;

import com.sivalabs.moviebuffs.config.security.SecurityConfigProperties;
import com.sivalabs.moviebuffs.config.security.TokenHelper;
import com.sivalabs.moviebuffs.core.repository.OrderRepository;
import com.sivalabs.moviebuffs.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static com.sivalabs.moviebuffs.core.utils.Constants.PROFILE_IT;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@ActiveProfiles({ PROFILE_IT })
@SpringBootTest(webEnvironment = RANDOM_PORT, classes = { MovieBuffsApplication.class, PostGreSQLContainer.class },
		properties = { "application.import-tmdb-data=false" })
@AutoConfigureMockMvc
public abstract class AbstractIntegrationTest {

	@Autowired
	protected MockMvc mockMvc;

	@Autowired
	protected ObjectMapper objectMapper;

	@Autowired
	protected UserService userService;

	@Autowired
	protected TokenHelper tokenHelper;

	@Autowired
	protected SecurityConfigProperties securityConfigProperties;

	@Autowired
	protected OrderRepository orderRepository;

}
