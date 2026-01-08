package com.sivalabs.moviebuffs.web.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationRequestDTO(@NotBlank(message = "UserName cannot be blank") String username,

		@NotBlank(message = "Password cannot be blank") String password) {

}
