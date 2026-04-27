package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.NegocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionWebController {

    @Autowired
    private ConfiguracionWebRepository configuracionWebRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @PostMapping("/negocio/{idNegocio}")
    public ResponseEntity<?> crearConfiguracion(@PathVariable Long idNegocio, @RequestBody ConfiguracionWeb nuevaConfig){

        Optional<Negocio> negocioDb = negocioRepository.findById(idNegocio);

        if (negocioDb.isPresent()) {
            nuevaConfig.setNegocio(negocioDb.get());
            ConfiguracionWeb configGuardada = configuracionWebRepository.save(nuevaConfig);
            return ResponseEntity.ok(configGuardada);
        } else {
            return ResponseEntity.badRequest().body("Error: No se encontro un negocio con ID " + idNegocio);
        }
    }
}
