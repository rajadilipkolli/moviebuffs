package com.sivalabs.moviebuffs.dataimporter;

import com.sivalabs.moviebuffs.dataimporter.common.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.JobExecution;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.test.JobOperatorTestUtils;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;


class MoviebuffsDataImporterApplicationTests extends AbstractIntegrationTest {

    @Autowired
    private JobOperatorTestUtils jobOperatorTestUtils;

    @Autowired
    private Job importMovieDataJob;

    @Test
    void contextLoads() {
        assertThat(mockMvc).isNotNull();
    }

    @Test
    void shouldImportMovieData() throws Exception {
        // Set the job for the test
        jobOperatorTestUtils.setJob(importMovieDataJob);

        // Given
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("jobId", String.valueOf(System.currentTimeMillis()))
                .toJobParameters();

        // When
        JobExecution jobExecution = jobOperatorTestUtils.startJob(jobParameters);

        // Then
        assertThat(jobExecution.getStatus()).isEqualTo(BatchStatus.COMPLETED);
    }
}
