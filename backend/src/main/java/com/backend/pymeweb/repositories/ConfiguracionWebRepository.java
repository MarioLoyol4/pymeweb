package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.ConfiguracionWeb;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfiguracionWebRepository extends JpaRepository<ConfiguracionWeb, Long> {
    @Query("SELECT c FROM ConfiguracionWeb c WHERE c.negocio.idNegocio = :idNegocio")
    Optional<ConfiguracionWeb> buscarPorIdNegocio(@Param("idNegocio") Long idNegocio);
}
