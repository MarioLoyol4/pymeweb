package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Seccion;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.SeccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secciones")
public class SeccionController {

    @Autowired
    private SeccionRepository seccionRepository;

    @Autowired
    private ConfiguracionWebRepository configuracionWebRepository;

    @PostMapping("/configuracion/{idConfiguracion}")
    public ResponseEntity<?> crearSeccion(@PathVariable Long idConfiguracion, @RequestBody Seccion nuevaSeccion){

        Optional<ConfiguracionWeb> configDb = configuracionWebRepository.findById(idConfiguracion);

        if (configDb.isPresent()) {
            nuevaSeccion.setConfiguracionWeb(configDb.get());
            Seccion seccionGuardada = seccionRepository.save(nuevaSeccion);
            return ResponseEntity.ok(seccionGuardada);
        } else {
            return ResponseEntity.badRequest().body("Error: No se encontro la configuracion con ID " + idConfiguracion);
        }
    }

    @GetMapping("/configuracion/{idConfiguracion}")
    public ResponseEntity<List<Seccion>> listarSeccionesPorConfig(@PathVariable Long idConfiguracion){
        return ResponseEntity.ok(seccionRepository.findAll());
    }
}
