package com.backend.pymeweb.models;

import jakarta.persistence.*;
import lombok.Data;

// anotacion de lombok que nos ahorra lineas de codigo de getters y setters
@Data
// convierte esta clase en una tabla de la base de datos
@Entity
@Table(name = "categorias")
public class Categoria {

    // define que esta es la primary key
    @Id
    // se autoincrementa
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCategoria;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private String nombreCategoria;

    // relacion varias a una, con el negocio
    @ManyToOne
    @JoinColumn(name = "id_negocio", nullable = false)
    private Negocio negocio;
}
