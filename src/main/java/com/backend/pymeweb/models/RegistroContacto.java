package com.backend.pymeweb.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

// anotacion de lombok que nos ahorra lineas de codigo de getters y setters
@Data
// convierte esta clase en una tabla de la base de datos
@Entity
@Table(name = "registro_contacto")
public class RegistroContacto {

    // define que esta es la primary key
    @Id
    // se autoincrementa
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRegistro;

    private LocalDateTime fechaContacto;

    private String canal;

    // esta columna no puede ser nulo y se define como texto
    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    private String estado; //EJ: "NUEVO", "LEIDO", "RESPONDIDO"

    // relacion varias a una, con el negocio
    @ManyToOne
    @JoinColumn(name = "id_negocio", nullable = false)
    private Negocio negocio;
}
