package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // encontrar al usuario segun el correo
    Optional<Usuario> findByEmail(String email);
}
