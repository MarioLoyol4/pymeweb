package com.backend.pymeweb.models;


import jakarta.persistence.*;
import lombok.Data;

// anotacion de lombok que nos ahorra lineas de codigo de getters y setters
@Data
// convierte esta clase en una tabla de la base de datos
@Entity
@Table(name = "secciones")
public class Seccion {

    // define que esta es la primary key
    @Id
    // se autoincrementa
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSeccion;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private String tipoSeccion;

    private Integer orden;

    // esta columna se define como texto
    @Column(columnDefinition = "TEXT")
    private String contenidoJson;

    private Boolean esVisible;

    // relacion varias a una, con la configuracion web
    @ManyToOne
    @JoinColumn(name = "id_configuracion", nullable = false)
    private ConfiguracionWeb configuracionWeb;
}
