package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.Categoria;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.repositories.CategoriaRepository;
import com.backend.pymeweb.repositories.NegocioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @PostMapping("/negocio/{idNegocio}")
    public ResponseEntity<?> crearCategoria(@PathVariable Long idNegocio, @RequestBody Categoria nuevaCategoria) {

        Optional<Negocio> negocioDb = negocioRepository.findById(idNegocio);

        if (negocioDb.isPresent()) {
            nuevaCategoria.setNegocio(negocioDb.get());
            Categoria categoriaGuardada = categoriaRepository.save(nuevaCategoria);
            return ResponseEntity.ok(categoriaGuardada);
        } else {
            return ResponseEntity.badRequest().body("Error: No se encontro un negocio con ID " + idNegocio);
        }
    }
}
