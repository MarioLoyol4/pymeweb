package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.Seccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeccionRepository extends JpaRepository<Seccion, Long> {
    @Query("SELECT s FROM Seccion s WHERE s.configuracionWeb.negocio.idNegocio = :idNegocio ORDER BY s.orden ASC")
    List<Seccion> obtenerSeccionesPorNegocio(@Param("idNegocio") Long idNegocio);
}
