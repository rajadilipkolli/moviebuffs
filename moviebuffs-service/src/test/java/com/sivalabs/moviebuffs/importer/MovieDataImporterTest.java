package com.sivalabs.moviebuffs.importer;

import com.opencsv.exceptions.CsvValidationException;
import com.sivalabs.moviebuffs.core.entity.Genre;
import com.sivalabs.moviebuffs.core.service.MovieService;
import com.sivalabs.moviebuffs.importer.mappers.CsvRowMapperUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tools.jackson.core.json.JsonReadFeature;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;

import static java.util.Collections.singletonList;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

class MovieDataImporterTest {

	private MovieDataImporter movieDataImporter;

	@BeforeEach
	void setUp() {
		JsonMapper jsonMapper = JsonMapper.builder().configure(JsonReadFeature.ALLOW_SINGLE_QUOTES, true).build();
		CsvRowMapperUtils csvRowMapperUtils = new CsvRowMapperUtils(jsonMapper);
		DataImportProperties dataImportProperties = new DataImportProperties();
		dataImportProperties.getTmdb().setDisabled(false);
		dataImportProperties.getTmdb().setMoviesDataFiles(singletonList("/data/movies_metadata-test.csv"));
		dataImportProperties.getTmdb().setMovieCreditsFiles(singletonList("/data/credits-test.csv"));

		MovieService movieService = mock(MovieService.class);

		given(movieService.saveGenre(any(Genre.class))).willAnswer(answer -> answer.getArgument(0));

		movieDataImporter = new MovieDataImporter(movieService, csvRowMapperUtils, dataImportProperties, jsonMapper);
	}

	@Test
	void should_import_movie_data_successfully() throws IOException, CsvValidationException {
		movieDataImporter.importData();
		assertTrue(true);
	}

}
