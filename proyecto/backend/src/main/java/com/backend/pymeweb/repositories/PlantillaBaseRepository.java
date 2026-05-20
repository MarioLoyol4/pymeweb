package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.PlantillaBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlantillaBaseRepository extends JpaRepository<PlantillaBase, Long> {

    Optional<PlantillaBase> findByTipoRubro(String tipoRubro);
}
