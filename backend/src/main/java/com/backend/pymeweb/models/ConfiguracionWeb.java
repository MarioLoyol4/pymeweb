package com.backend.pymeweb.models;


import jakarta.persistence.*;
import lombok.Data;

// anotacion de lombok que nos ahorra lineas de codigo de getters y setters
@Data
// convierte esta clase en una tabla de la base de datos
@Entity
@Table(name = "configuracion_web")
public class ConfiguracionWeb {

    // define que esta es la primary key
    @Id
    // se autoincrementa
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConfiguracion;

    private String temaGlobal;
    private String colorPrincipal;
    private String tipografia;

    // relacion una a una, con el negocio
    @OneToOne
    @JoinColumn(name = "id_negocio", nullable = false)
    private Negocio negocio;
}
