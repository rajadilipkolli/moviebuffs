package com.sivalabs.moviebuffs;

import org.springframework.boot.SpringApplication;

import com.sivalabs.moviebuffs.common.PostGreSQLContainer;
import com.sivalabs.moviebuffs.common.TestConfig;

public class TestMovieBuffsApplication {

    public static void main(String[] args) {
        SpringApplication.from(MovieBuffsApplication::main)
                .with(TestConfig.class, PostGreSQLContainer.class)
                .run(args);
    }
}
