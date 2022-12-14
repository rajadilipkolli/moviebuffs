package com.sivalabs.moviebuffs.web.api.advice;

import com.sivalabs.moviebuffs.core.exception.ApplicationException;
import com.sivalabs.moviebuffs.core.exception.BadRequestException;
import com.sivalabs.moviebuffs.core.exception.ResourceNotFoundException;
import com.sivalabs.moviebuffs.web.api.UserRestController;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.NativeWebRequest;

@Slf4j
@RestControllerAdvice(basePackageClasses = UserRestController.class)
public class GlobalExceptionHandler {

	@ExceptionHandler(value = ResourceNotFoundException.class)
	ResponseEntity<ProblemDetail> handleResourceNotFoundException(ResourceNotFoundException exception,
			NativeWebRequest request) {
		log.error(exception.getLocalizedMessage(), exception);
		return create(HttpStatus.NOT_FOUND, exception, request);
	}

	@ExceptionHandler(value = ApplicationException.class)
	ResponseEntity<ProblemDetail> handleApplicationException(ApplicationException exception, NativeWebRequest request) {
		log.error(exception.getLocalizedMessage(), exception);
		return create(HttpStatus.BAD_REQUEST, exception, request);
	}

	@ExceptionHandler(value = BadRequestException.class)
	ResponseEntity<ProblemDetail> handleBadRequestException(BadRequestException exception, NativeWebRequest request) {
		log.error(exception.getLocalizedMessage(), exception);
		return create(HttpStatus.BAD_REQUEST, exception, request);
	}

	private ResponseEntity<ProblemDetail> create(HttpStatus httpStatus, Exception exception, NativeWebRequest request) {

		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatusCode.valueOf(httpStatus.value()),
				exception.getMessage());
		return ResponseEntity.status(httpStatus.value()).body(problemDetail);
	}

}
