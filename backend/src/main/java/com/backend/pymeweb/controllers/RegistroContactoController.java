package com.backend.pymeweb.controllers;


import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.RegistroContacto;
import com.backend.pymeweb.repositories.NegocioRepository;
import com.backend.pymeweb.repositories.RegistroContactoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/contactos")
public class RegistroContactoController {

    @Autowired
    private RegistroContactoRepository contactoRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @PostMapping("/negocio/{idNegocio}")
    public ResponseEntity<?> enviarMensaje(@PathVariable Long idNegocio, @RequestBody RegistroContacto nuevoMensaje) {

        Optional<Negocio> negocioDb = negocioRepository.findById(idNegocio);

        if (negocioDb.isPresent()) {
            nuevoMensaje.setNegocio(negocioDb.get());

            nuevoMensaje.setFechaContacto(LocalDateTime.now());

            RegistroContacto mensajeGuardado = contactoRepository.save(nuevoMensaje);

            return ResponseEntity.ok(mensajeGuardado);
        } else {
            return ResponseEntity.badRequest().body("Error no se encontro el negocio con ID " + idNegocio);
        }
    }

    @GetMapping("/negocio/{idNegocio}")
    public ResponseEntity<?> revisarBuzon(@PathVariable Long idNegocio) {
        return ResponseEntity.ok(contactoRepository.findByNegocioIdNegocio(idNegocio));
    }
}
