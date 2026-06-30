package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.Seccion;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.NegocioRepository;
import com.backend.pymeweb.repositories.SeccionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class SeccionControllerTest {

    @Mock private SeccionRepository seccionRepository;
    @Mock private ConfiguracionWebRepository configuracionWebRepository;
    @Mock private NegocioRepository negocioRepository;

    @InjectMocks
    private SeccionController seccionController;

    private Seccion seccionExistente;

    @BeforeEach
    void setUp() {
        seccionExistente = new Seccion();
        seccionExistente.setIdSeccion(1L);
        seccionExistente.setTipoSeccion("CABECERA");
        seccionExistente.setOrden(1);
        seccionExistente.setContenidoJson("{\"titulo\":\"viejo\"}");
        seccionExistente.setEsVisible(true);
    }



    @Test
    void deberiaRechazarCreacionSiNegocioNoTieneConfiguracionWeb() {
        when(configuracionWebRepository.buscarPorIdNegocio(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> respuesta = seccionController.crearSeccionParaNegocio(99L, new Seccion());

        assertEquals(400, respuesta.getStatusCode().value());
        verify(seccionRepository, never()).save(any());
    }

    @Test
    void deberiaCrearSeccionCuandoConfiguracionWebExiste() {
        ConfiguracionWeb config = new ConfiguracionWeb();
        config.setIdConfiguracion(10L);
        when(configuracionWebRepository.buscarPorIdNegocio(1L)).thenReturn(Optional.of(config));

        Seccion nueva = new Seccion();
        nueva.setTipoSeccion("SERVICIOS");
        when(seccionRepository.save(any(Seccion.class))).thenAnswer(inv -> inv.getArgument(0));

        ResponseEntity<?> respuesta = seccionController.crearSeccionParaNegocio(1L, nueva);

        assertEquals(200, respuesta.getStatusCode().value());
        Seccion guardada = (Seccion) respuesta.getBody();
        assertNotNull(guardada);
        assertEquals(config, guardada.getConfiguracionWeb());
    }



    @Test
    void deberiaActualizarLosCamposDeUnaSeccionExistente() {
        when(seccionRepository.findById(1L)).thenReturn(Optional.of(seccionExistente));
        when(seccionRepository.save(any(Seccion.class))).thenAnswer(inv -> inv.getArgument(0));

        Seccion datosNuevos = new Seccion();
        datosNuevos.setTipoSeccion("SERVICIOS");
        datosNuevos.setOrden(2);
        datosNuevos.setContenidoJson("{\"titulo\":\"nuevo\"}");
        datosNuevos.setEsVisible(false);

        ResponseEntity<?> respuesta = seccionController.editarSeccion(1L, datosNuevos);

        assertEquals(200, respuesta.getStatusCode().value());
        Seccion actualizada = (Seccion) respuesta.getBody();
        assertEquals("SERVICIOS", actualizada.getTipoSeccion());
        assertEquals(2, actualizada.getOrden());
        assertEquals("{\"titulo\":\"nuevo\"}", actualizada.getContenidoJson());
        assertFalse(actualizada.getEsVisible());
    }

    @Test
    void deberiaRetornar404AlEditarSeccionInexistente() {
        when(seccionRepository.findById(999L)).thenReturn(Optional.empty());

        ResponseEntity<?> respuesta = seccionController.editarSeccion(999L, new Seccion());

        assertEquals(404, respuesta.getStatusCode().value());
        verify(seccionRepository, never()).save(any());
    }



    @Test
    void deberiaEliminarSeccionExistente() {
        when(seccionRepository.existsById(1L)).thenReturn(true);

        ResponseEntity<?> respuesta = seccionController.eliminarSeccion(1L);

        assertEquals(200, respuesta.getStatusCode().value());
        verify(seccionRepository, times(1)).deleteById(1L);
    }

    @Test
    void deberiaRetornar404AlEliminarSeccionInexistente() {
        when(seccionRepository.existsById(999L)).thenReturn(false);

        ResponseEntity<?> respuesta = seccionController.eliminarSeccion(999L);

        assertEquals(404, respuesta.getStatusCode().value());
        verify(seccionRepository, never()).deleteById(anyLong());
    }



    @Test
    void deberiaRetornarNoContentSiNegocioNoTieneSecciones() {
        when(seccionRepository.obtenerSeccionesPorNegocio(5L)).thenReturn(Collections.emptyList());

        ResponseEntity<List<Seccion>> respuesta = seccionController.obtenerSeccionesPorNegocio(5L);

        assertEquals(204, respuesta.getStatusCode().value());
    }

    @Test
    void deberiaRetornarListaDeSeccionesSiExisten() {
        when(seccionRepository.obtenerSeccionesPorNegocio(5L))
                .thenReturn(List.of(seccionExistente));

        ResponseEntity<List<Seccion>> respuesta = seccionController.obtenerSeccionesPorNegocio(5L);

        assertEquals(200, respuesta.getStatusCode().value());
        assertEquals(1, respuesta.getBody().size());
    }



    @Test
    void deberiaRetornar404SiElSlugNoExiste() {
        when(negocioRepository.findBySlug("slug-inexistente")).thenReturn(Optional.empty());

        ResponseEntity<List<Seccion>> respuesta =
                seccionController.obtenerSeccionesPorSlug("slug-inexistente");

        assertEquals(404, respuesta.getStatusCode().value());
        verify(seccionRepository, never()).obtenerSeccionesPorNegocio(anyLong());
    }

    @Test
    void deberiaRetornarNoContentSiElNegocioDelSlugNoTieneSecciones() {
        Negocio negocio = new Negocio();
        negocio.setIdNegocio(3L);
        when(negocioRepository.findBySlug("mascotas-web")).thenReturn(Optional.of(negocio));
        when(seccionRepository.obtenerSeccionesPorNegocio(3L)).thenReturn(Collections.emptyList());

        ResponseEntity<List<Seccion>> respuesta =
                seccionController.obtenerSeccionesPorSlug("mascotas-web");

        assertEquals(204, respuesta.getStatusCode().value());
    }

    @Test
    void deberiaRetornarSeccionesCuandoElSlugEsValido() {
        Negocio negocio = new Negocio();
        negocio.setIdNegocio(3L);
        negocio.setSlug("mascotas-web");

        when(negocioRepository.findBySlug("mascotas-web")).thenReturn(Optional.of(negocio));
        when(seccionRepository.obtenerSeccionesPorNegocio(3L)).thenReturn(List.of(seccionExistente));

        ResponseEntity<List<Seccion>> respuesta =
                seccionController.obtenerSeccionesPorSlug("mascotas-web");

        assertEquals(200, respuesta.getStatusCode().value());
        assertEquals(1, respuesta.getBody().size());
        assertEquals("CABECERA", respuesta.getBody().get(0).getTipoSeccion());
    }
}