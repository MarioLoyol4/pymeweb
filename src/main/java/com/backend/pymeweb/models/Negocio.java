package com.backend.pymeweb.models;

import jakarta.persistence.*;
import lombok.Data;

// anotacion de lombok que nos ahorra lineas de codigo de getters y setters
@Data
// convierte esta clase en una tabla de la base de datos
@Entity
@Table(name = "negocios")
public class Negocio {

    // define que esta es la primary key
    @Id
    // se autoincrementa
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNegocio;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private String nombreNegocio;

    // esta columna no puede ser nulo
    @Column(nullable = false)
    private String tipoRubro;

    private String telefonoWhatsapp;

    private String logoUrl;

    // relacion uno a uno, con el usuario (Foreign Key)
    @OneToOne
    @JoinColumn(name = "id_usuario", referencedColumnName = "idUsuario")
    private Usuario usuario;
}
