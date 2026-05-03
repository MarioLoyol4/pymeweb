package com.backend.pymeweb.models;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "plantillas_base")
public class PlantillaBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlantilla;

    @Column(unique = true, nullable = false)
    private String tipoRubro;

    @Column(columnDefinition = "JSON", nullable = false)
    private String contenidoJson;

    @Column(nullable = false)
    private boolean requiereInventario = false;
}
