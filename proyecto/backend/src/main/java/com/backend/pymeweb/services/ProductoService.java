package com.backend.pymeweb.services;

import com.backend.pymeweb.models.Producto;
import com.backend.pymeweb.repositories.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> findByIdProducto(Long id) {
        return productoRepository.findByIdProducto(id);
    }
    public Producto findById(Long id) {
        return productoRepository.findById(id).orElse(null);
    }
    public Producto agregarProducto(Producto producto) {
        return productoRepository.save(producto);
    }
    public Producto actualizarProducto(Long id, Producto productoactualizado) {
     Optional<Producto> productoOpcional = productoRepository.findById(id);

     if (productoOpcional.isEmpty()) {
         throw new RuntimeException("Producto no encontrado con el id: " + id);
     }
     Producto productoExistente = productoOpcional.get();

     productoExistente.setNombre(productoactualizado.getNombre());
     productoExistente.setDescripcion(productoactualizado.getDescripcion());
     productoExistente.setPrecio(productoactualizado.getPrecio());
     productoExistente.setImagen(productoactualizado.getImagen());
     productoExistente.setCantidad(productoactualizado.getCantidad());

     return productoRepository.save(productoExistente);
    }
    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con el id: " + id);
        }
        productoRepository.deleteById(id);
    }
}
