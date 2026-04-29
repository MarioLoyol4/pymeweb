package com.backend.pymeweb.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API PymeWeb - Plataforma SaaS")
                        .version("1.0.0")
                        .description("Documentación oficial del backend transaccional para el Page Builder, inventario y gestión de locales."));

    }
}
