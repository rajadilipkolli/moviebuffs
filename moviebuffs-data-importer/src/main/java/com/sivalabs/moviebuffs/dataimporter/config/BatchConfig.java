package com.sivalabs.moviebuffs.dataimporter.config;

import com.opencsv.exceptions.CsvValidationException;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.transaction.PlatformTransactionManager;

import java.io.IOException;

@Configuration
public class BatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    @Value("classpath:/data/movies_metadata_small.csv")
    private Resource inputResource;

    public BatchConfig(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        this.jobRepository = jobRepository;
        this.transactionManager = transactionManager;
    }

    @Bean
    Job importMovieDataJob() throws IOException, CsvValidationException {
        return new JobBuilder("importMovieDataJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(step())
                .build();
    }

    @Bean
    Step step() throws IOException, CsvValidationException {
        return new StepBuilder("execution-step", jobRepository)
                .<MovieCsvRecord, MovieCsvRecord>chunk(5, transactionManager)
                .reader(reader())
                //.processor(processor())
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
                System.out.println(record);
            }
        };
    }
}
