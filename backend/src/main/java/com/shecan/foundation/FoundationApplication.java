package com.shecan.foundation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class FoundationApplication {
    public static void main(String[] args) {
        SpringApplication.run(FoundationApplication.class, args);
    }
}
