package com.backend.pymeweb.controllerTest;


import com.backend.pymeweb.controllers.ProductoController;
import com.backend.pymeweb.models.Producto;
import com.backend.pymeweb.services.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoControllerTest {

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ProductoController productoController;

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

    // ===================== GET listarProductos =====================

    @Test
    void listarProductos_retornaLista200() {
        when(productoService.ListaProductos()).thenReturn(List.of(producto));

        ResponseEntity<List<Producto>> response = productoController.listarProductos();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Alimento Premium para Perros 15kg", response.getBody().get(0).getNombre());
    }

    @Test
    void listarProductos_retornaListaVacia200() {
        when(productoService.ListaProductos()).thenReturn(List.of());

        ResponseEntity<List<Producto>> response = productoController.listarProductos();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    // ===================== GET obtenerProducto =====================

    @Test
    void obtenerProducto_retornaProducto200() {
        when(productoService.findById(1L)).thenReturn(producto);

        ResponseEntity<Producto> response = productoController.obtenerProducto(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Alimentos", response.getBody().getCategoria());
    }

    @Test
    void obtenerProducto_retornaNullCuandoNoExiste() {
        when(productoService.findById(99L)).thenReturn(null);

        ResponseEntity<Producto> response = productoController.obtenerProducto(99L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());
    }

    // ===================== POST crearProducto =====================

    @Test
    void crearProducto_retornaProductoCreado200() {
        when(productoService.agregarProducto(any(Producto.class))).thenReturn(producto);

        ResponseEntity<Producto> response = productoController.crearProducto(producto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Alimento Premium para Perros 15kg", response.getBody().getNombre());
        assertEquals(50, response.getBody().getCantidad());
        verify(productoService, times(1)).agregarProducto(any(Producto.class));
    }

    // ===================== PUT actualizarProducto =====================

    @Test
    void actualizarProducto_retornaProductoActualizado200() {
        Producto actualizado = new Producto();
        actualizado.setNombre("Alimento Premium 20kg");
        actualizado.setDescripcion("Nueva presentación");
        actualizado.setPrecio(39990);
        actualizado.setCantidad(30);
        actualizado.setCategoria("Alimentos");

        when(productoService.actualizarProducto(eq(1L), any(Producto.class))).thenReturn(actualizado);

        ResponseEntity<Producto> response = productoController.actualizarProducto(1L, actualizado);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Alimento Premium 20kg", response.getBody().getNombre());
        assertEquals(39990, response.getBody().getPrecio());
    }

    @Test
    void actualizarProducto_lanzaExcepcionCuandoNoExiste() {
        when(productoService.actualizarProducto(eq(99L), any(Producto.class)))
                .thenThrow(new RuntimeException("Producto no encontrado con el id: 99"));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productoController.actualizarProducto(99L, producto));

        assertEquals("Producto no encontrado con el id: 99", ex.getMessage());
    }

    // ===================== DELETE eliminarProducto =====================

    @Test
    void eliminarProducto_retorna204() {
        doNothing().when(productoService).eliminarProducto(1L);

        ResponseEntity<Void> response = productoController.eliminarProducto(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(productoService, times(1)).eliminarProducto(1L);
    }

    @Test
    void eliminarProducto_lanzaExcepcionCuandoNoExiste() {
        doThrow(new RuntimeException("Producto no encontrado con el id: 99"))
                .when(productoService).eliminarProducto(99L);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productoController.eliminarProducto(99L));

        assertEquals("Producto no encontrado con el id: 99", ex.getMessage());
    }
}
