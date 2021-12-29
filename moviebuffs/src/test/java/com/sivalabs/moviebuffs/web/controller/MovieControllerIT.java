package com.sivalabs.moviebuffs.web.controller;

import com.sivalabs.moviebuffs.common.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MovieControllerIT extends AbstractIntegrationTest {

	@Test
	void shouldFetchAllCategories() throws Exception {
		this.mockMvc.perform(get("/")).andExpect(status().isOk());
	}

}
