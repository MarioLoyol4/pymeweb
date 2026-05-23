package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.PlantillaBase;
import com.backend.pymeweb.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByIdProducto(Long id);
}
