package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.Categoria;
import com.backend.pymeweb.models.ItemsCatalogo;
import com.backend.pymeweb.repositories.CategoriaRepository;
import com.backend.pymeweb.repositories.ItemsCatalogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventario")
public class ItemsCatalogoController {

    @Autowired
    private ItemsCatalogoRepository itemsCatalogoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @PostMapping("/categoria/{idCategoria}")
    public ResponseEntity<?> agregarProducto(@PathVariable Long idCategoria, @RequestBody ItemsCatalogo nuevoItem) {
        Optional<Categoria> categoriaDb = categoriaRepository.findById(idCategoria);

        if (categoriaDb.isPresent()) {
            nuevoItem.setCategoria(categoriaDb.get());
            ItemsCatalogo itemGuardado = itemsCatalogoRepository.save(nuevoItem);

            return ResponseEntity.ok(itemGuardado);
        } else {
            return ResponseEntity.badRequest().body("Error: No se encontro la categoria con ID " + idCategoria);
        }
    }

    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<ItemsCatalogo>> obtenerProductosPorCategoria(@PathVariable Long idCategoria){

        List<ItemsCatalogo> productos = itemsCatalogoRepository.findByCategoriaIdCategoria(idCategoria);

        return ResponseEntity.ok(productos);
    }
}
