package com.sivalabs.moviebuffs.common;

import tools.jackson.databind.ObjectMapper;
import com.sivalabs.moviebuffs.config.security.TokenHelper;
import com.sivalabs.moviebuffs.core.service.SecurityService;
import com.sivalabs.moviebuffs.core.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles(Constants.PROFILE_TEST)
@Import({ TestConfig.class })
public abstract class AbstractMvcUnitTest {

	@Autowired
	protected MockMvc mockMvc;

	@Autowired
	protected ObjectMapper objectMapper;

	@MockitoBean
	protected UserDetailsService userDetailsService;

	@MockitoBean
	protected TokenHelper tokenHelper;

	@MockitoBean
	protected SecurityService securityService;

}
