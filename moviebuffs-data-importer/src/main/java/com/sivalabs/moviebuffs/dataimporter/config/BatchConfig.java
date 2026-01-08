package com.sivalabs.moviebuffs.dataimporter.config;

import com.opencsv.exceptions.CsvValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.job.parameters.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.Step;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.infrastructure.item.ItemReader;
import org.springframework.batch.infrastructure.item.ItemWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;

@Configuration
public class BatchConfig {

	private static final Logger log = LoggerFactory.getLogger(BatchConfig.class);

	private final JobRepository jobRepository;

	@Value("classpath:/data/movies_metadata_small.csv")
	private Resource inputResource;

	public BatchConfig(JobRepository jobRepository) {
		this.jobRepository = jobRepository;
	}

	@Bean
	Job importMovieDataJob() throws IOException, CsvValidationException {
		return new JobBuilder("importMovieDataJob", jobRepository).incrementer(new RunIdIncrementer())
			.start(step())
			.build();
	}

	@Bean
	Step step() throws IOException, CsvValidationException {
		return new StepBuilder("execution-step", jobRepository).<MovieCsvRecord, MovieCsvRecord>chunk(5)
			.reader(reader())
			// .processor(processor())
			.writer(writer())
			.build();
	}

	@Bean
	ItemReader<MovieCsvRecord> reader() throws IOException, CsvValidationException {
		return new OpenCsvItemReader(inputResource, 1);
	}

	@Bean
	ItemWriter<MovieCsvRecord> writer() {
		return items -> {
			for (MovieCsvRecord record : items) {
				log.info("Movie :{}", record);
			}
		};
	}

}
