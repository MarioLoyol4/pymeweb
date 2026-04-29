package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.Usuario;
import com.backend.pymeweb.repositories.NegocioRepository;
import com.backend.pymeweb.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/negocios")
public class NegocioController {

    @Autowired
    private NegocioRepository negocioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> crearNegocioParaUsuario(@PathVariable Long idUsuario, @RequestBody Negocio nuevoNegocio){
        Optional<Usuario> usuarioDb = usuarioRepository.findById(idUsuario);

        if (usuarioDb.isPresent()) {
            nuevoNegocio.setUsuario(usuarioDb.get());

            Negocio negocioGuardado = negocioRepository.save(nuevoNegocio);

            return ResponseEntity.ok(negocioGuardado);
        } else {
            return ResponseEntity.badRequest().body("ERROR: No se encontró ningún usuario con el ID " + idUsuario);
        }
    }

}
