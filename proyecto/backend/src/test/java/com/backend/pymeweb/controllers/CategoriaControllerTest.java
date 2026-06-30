package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.Categoria;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.repositories.CategoriaRepository;
import com.backend.pymeweb.repositories.NegocioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class CategoriaControllerTest {

    @Mock private CategoriaRepository categoriaRepository;
    @Mock private NegocioRepository negocioRepository;

    @InjectMocks
    private CategoriaController categoriaController;

    @Test
    void deberiaRechazarCreacionSiElNegocioNoExiste() {
        when(negocioRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> respuesta = categoriaController.crearCategoria(99L, new Categoria());

        assertEquals(400, respuesta.getStatusCode().value());
        assertEquals("Error: No se encontro un negocio con ID 99", respuesta.getBody());
        verify(categoriaRepository, never()).save(any());
    }

    @Test
    void deberiaCrearCategoriaYAsociarlaAlNegocioExistente() {
        Negocio negocio = new Negocio();
        negocio.setIdNegocio(1L);
        negocio.setNombreNegocio("MascotasWeb");

        Categoria nuevaCategoria = new Categoria();
        nuevaCategoria.setNombreCategoria("Alimentos");

        when(negocioRepository.findById(1L)).thenReturn(Optional.of(negocio));
        when(categoriaRepository.save(any(Categoria.class))).thenAnswer(inv -> inv.getArgument(0));

        ResponseEntity<?> respuesta = categoriaController.crearCategoria(1L, nuevaCategoria);

        assertEquals(200, respuesta.getStatusCode().value());

        ArgumentCaptor<Categoria> captor = ArgumentCaptor.forClass(Categoria.class);
        verify(categoriaRepository).save(captor.capture());
        assertEquals(negocio, captor.getValue().getNegocio());
        assertEquals("Alimentos", captor.getValue().getNombreCategoria());
    }

    @Test
    void deberiaRetornarLaCategoriaGuardadaEnElCuerpoDeLaRespuesta() {
        Negocio negocio = new Negocio();
        negocio.setIdNegocio(2L);

        Categoria categoriaGuardada = new Categoria();
        categoriaGuardada.setIdCategoria(10L);
        categoriaGuardada.setNombreCategoria("Juguetes");

        when(negocioRepository.findById(2L)).thenReturn(Optional.of(negocio));
        when(categoriaRepository.save(any(Categoria.class))).thenReturn(categoriaGuardada);

        ResponseEntity<?> respuesta = categoriaController.crearCategoria(2L, new Categoria());

        Categoria cuerpo = (Categoria) respuesta.getBody();
        assertNotNull(cuerpo);
        assertEquals(10L, cuerpo.getIdCategoria());
        assertEquals("Juguetes", cuerpo.getNombreCategoria());
    }
}