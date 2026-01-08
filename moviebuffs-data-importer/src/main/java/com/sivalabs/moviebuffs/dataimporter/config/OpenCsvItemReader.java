package com.sivalabs.moviebuffs.dataimporter.config;

import com.opencsv.CSVIterator;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.batch.infrastructure.item.ExecutionContext;
import org.springframework.batch.infrastructure.item.ItemReader;
import org.springframework.batch.infrastructure.item.ItemStream;
import org.springframework.batch.infrastructure.item.ItemStreamException;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStreamReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OpenCsvItemReader implements ItemReader<MovieCsvRecord>, ItemStream {

	private final CSVIterator csvIterator;

	private final CSVReader csvReader;

	private static final Logger logger = LoggerFactory.getLogger(OpenCsvItemReader.class);

	public OpenCsvItemReader(Resource inputResource, int skipLines) throws IOException, CsvValidationException {
		InputStreamReader inputStreamReader = new InputStreamReader(inputResource.getInputStream());
		this.csvReader = new CSVReader(inputStreamReader);
		csvReader.skip(skipLines);
		this.csvIterator = new CSVIterator(csvReader);
	}

	@Override
	public MovieCsvRecord read() {
		if (csvIterator.hasNext()) {
			String[] nextLine = csvIterator.next();
			return parseMovieRecord(nextLine);
		}
		return null;
	}

	private MovieCsvRecord parseMovieRecord(String[] nextLine) {
		return MovieCsvRecord.builder()
			.adult(nextLine[0])
			.belongsToCollection(nextLine[1])
			.budget(nextLine[2])
			.genres(nextLine[3])
			.homepage(nextLine[4])
			.id(nextLine[5])
			.imdbId(nextLine[6])
			.originalLanguage(nextLine[7])
			.originalTitle(nextLine[8])
			.overview(nextLine[9])
			.popularity(nextLine[10])
			.posterPath(nextLine[11])
			.productionCompanies(nextLine[12])
			.productionCountries(nextLine[13])
			.releaseDate(nextLine[14])
			.revenue(nextLine[15])
			.runtime(nextLine[16])
			.spokenLanguages(nextLine[17])
			.status(nextLine[18])
			.tagline(nextLine[19])
			.title(nextLine[20])
			.video(nextLine[21])
			.voteAverage(nextLine[22])
			.voteCount(nextLine[23])
			.build();
	}

	@Override
	public void open(ExecutionContext executionContext) throws ItemStreamException {
		// Initialization logic if needed
	}

	@Override
	public void update(ExecutionContext executionContext) throws ItemStreamException {
		// Update logic if needed (can be empty)
	}

	@Override
	public void close() {
		try {
			if (csvReader != null) {
				csvReader.close();
			}
		}
		catch (IOException e) {
			logger.warn("Failed to close csvReader", e);
		}
	}

}
