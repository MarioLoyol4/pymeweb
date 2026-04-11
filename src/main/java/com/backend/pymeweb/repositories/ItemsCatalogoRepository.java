package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.ItemsCatalogo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemsCatalogoRepository extends JpaRepository<ItemsCatalogo, Long> {

    // encontrar item del catalogo segun el id de la caregoria
    List<ItemsCatalogo> findByCategoriaIdCategoria(Long idCategoria);
}
