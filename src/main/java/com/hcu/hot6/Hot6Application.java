package com.hcu.hot6;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@ServletComponentScan
@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class Hot6Application {

    public static void main(String[] args) {
        SpringApplication.run(Hot6Application.class, args);
    }
}
