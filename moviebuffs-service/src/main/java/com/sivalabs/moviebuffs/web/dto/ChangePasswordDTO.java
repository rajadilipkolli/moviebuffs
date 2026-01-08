package com.sivalabs.moviebuffs.web.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordDTO(@NotBlank(message = "Old password cannot be blank") String oldPassword,

		@NotBlank(message = "New password cannot be blank") String newPassword) {

}
