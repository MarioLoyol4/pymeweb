package com.backend.pymeweb.models;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

// anotacion de lombok que nos ahorra lineas de codigo de getters y setters
@Data
// convierte esta clase en una tabla de la base de datos
@Entity
@Table(name = "items_catalogo")
public class ItemsCatalogo {

    // define que esta es la primary key
    @Id
    // se autoincrementa
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItem;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private String nombreItem;

    private String descripcion;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private BigDecimal precio;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private Integer stock;

    private String imagenUrl;

    private String estado; // EJ: "DISPONIBLE", "AGOTADO"

    // relacion varias a una, con la categoria
    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;
}
