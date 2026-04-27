package com.backend.pymeweb.controllers;


import com.backend.pymeweb.models.Usuario;
import com.backend.pymeweb.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// spring sabe que esta clase es una API REST y devuelve JSON
@RestController
// URL base
@RequestMapping("/api/usuarios")
public class UsuarioController {

//
    @Autowired
    private UsuarioRepository usuarioRepository;

//  Pide informacion
    @GetMapping
    public List<Usuario> listarUsuarios(){
//      busca todos los usuarios de la base de datos y los devuelve
        return usuarioRepository.findAll();
    }

//  Envia infromacion nueva
    @PostMapping
    public Usuario registrarUsuario(@RequestBody Usuario nuevoUsuario){
//      El JSON de la peticion lo convierte a una clase usuario y lo guarda
        return usuarioRepository.save(nuevoUsuario);
    }
}
