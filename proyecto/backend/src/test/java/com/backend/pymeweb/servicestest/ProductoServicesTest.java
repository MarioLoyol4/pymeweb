package com.backend.pymeweb.servicestest;

import com.backend.pymeweb.models.Producto;
import com.backend.pymeweb.repositories.ProductoRepository;
import com.backend.pymeweb.services.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServicesTest {

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoService productoService;

    private Producto producto;

    @BeforeEach
    void setUp() {
        producto = new Producto();
        producto.setId(1L);
        producto.setNombre("Alimento Premium para Perros 15kg");
        producto.setDescripcion("Alimento balanceado para perros adultos");
        producto.setPrecio(29990);
        producto.setImagen("https://ejemplo.com/imagen.jpg");
        producto.setCantidad(50);
        producto.setCategoria("Alimentos");
    }

    // ===================== ListaProductos =====================

    @Test
    void listaProductos_retornaListaConProductos() {
        Producto otro = new Producto();
        otro.setId(2L);
        otro.setNombre("Arena Sanitaria 10kg");
        when(productoRepository.findAll()).thenReturn(List.of(producto, otro));

        List<Producto> resultado = productoService.ListaProductos();

        assertEquals(2, resultado.size());
        assertEquals("Alimento Premium para Perros 15kg", resultado.get(0).getNombre());
        verify(productoRepository, times(1)).findAll();
    }

    @Test
    void listaProductos_retornaListaVaciaSiNoHayProductos() {
        when(productoRepository.findAll()).thenReturn(List.of());

        List<Producto> resultado = productoService.ListaProductos();

        assertTrue(resultado.isEmpty());
        verify(productoRepository, times(1)).findAll();
    }

    // ===================== findById =====================

    @Test
    void findById_retornaProductoCuandoExiste() {
        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));

        Producto resultado = productoService.findById(1L);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Alimento Premium para Perros 15kg", resultado.getNombre());
    }

    @Test
    void findById_retornaNullCuandoNoExiste() {
        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        Producto resultado = productoService.findById(99L);

        assertNull(resultado);
    }

    // ===================== agregarProducto =====================

    @Test
    void agregarProducto_guardaYRetornaProducto() {
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);

        Producto resultado = productoService.agregarProducto(producto);

        assertNotNull(resultado);
        assertEquals("Alimento Premium para Perros 15kg", resultado.getNombre());
        assertEquals(29990, resultado.getPrecio());
        verify(productoRepository, times(1)).save(producto);
    }

    // ===================== actualizarProducto =====================

    @Test
    void actualizarProducto_actualizaCorrectamenteCuandoExiste() {
        Producto actualizado = new Producto();
        actualizado.setNombre("Alimento Premium 20kg");
        actualizado.setDescripcion("Nueva presentación más grande");
        actualizado.setPrecio(39990);
        actualizado.setImagen("https://ejemplo.com/nueva-imagen.jpg");
        actualizado.setCantidad(30);

        when(productoRepository.findById(1L)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenAnswer(inv -> inv.getArgument(0));

        Producto resultado = productoService.actualizarProducto(1L, actualizado);

        assertEquals("Alimento Premium 20kg", resultado.getNombre());
        assertEquals("Nueva presentación más grande", resultado.getDescripcion());
        assertEquals(39990, resultado.getPrecio());
        assertEquals(30, resultado.getCantidad());
        verify(productoRepository, times(1)).findById(1L);
        verify(productoRepository, times(1)).save(any(Producto.class));
    }

    @Test
    void actualizarProducto_lanzaExcepcionCuandoNoExiste() {
        Producto actualizado = new Producto();
        actualizado.setNombre("No existe");

        when(productoRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productoService.actualizarProducto(99L, actualizado));

        assertEquals("Producto no encontrado con el id: 99", ex.getMessage());
        verify(productoRepository, never()).save(any());
    }

    // ===================== eliminarProducto =====================

    @Test
    void eliminarProducto_eliminaCorrectamenteCuandoExiste() {
        when(productoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(productoRepository).deleteById(1L);

        assertDoesNotThrow(() -> productoService.eliminarProducto(1L));

        verify(productoRepository, times(1)).existsById(1L);
        verify(productoRepository, times(1)).deleteById(1L);
    }

    @Test
    void eliminarProducto_lanzaExcepcionCuandoNoExiste() {
        when(productoRepository.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productoService.eliminarProducto(99L));

        assertEquals("Producto no encontrado con el id: 99", ex.getMessage());
        verify(productoRepository, never()).deleteById(any());
    }
}