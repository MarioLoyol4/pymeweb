package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Buscar por nombre
    Optional<Producto> findByNombre(String nombre);

    // Buscar todos los productos con cierta cantidad
    List<Producto> findByCantidad(int cantidad);

}
