package com.shecan.foundation.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("She Can Foundation API")
                        .description("Backend API for She Can Foundation contact form and admin panel")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("She Can Foundation")
                                .email("president@shecanfoundation.org")
                                .url("https://www.shecanfoundation.org"))
                        .license(new License().name("NGO — She Can Foundation 2025")))
                .components(new Components()
                        .addSecuritySchemes("AdminKeyAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER)
                                        .name("X-Admin-Key")
                                        .description("Admin secret key for /api/admin/** endpoints")));
    }
}
