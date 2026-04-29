package com.backend.pymeweb.models;

import jakarta.persistence.*;
import lombok.Data;

// anotacion de lombok que nos ahorra lineas de codigo de getters y setters
@Data
// convierte esta clase en una tabla de la base de datos
@Entity
@Table(name = "usuarios")

public class Usuario {

    // define que esta es la primary key
    @Id
    // se autoincrementa
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    // esta columna no puede ser nulo y tampoco se puede repetir
    @Column(nullable = false, unique = true)
    private String email;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private String password;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private String rol; // EJ: "EMPRENDEDOR" O "ADMIN"
}
