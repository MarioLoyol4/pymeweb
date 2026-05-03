package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NegocioRepository extends JpaRepository<Negocio, Long> {
    Optional<Negocio> findByUsuario(Usuario usuario);
}
