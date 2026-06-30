package com.backend.pymeweb.services;

import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.PlantillaBase;
import com.backend.pymeweb.models.Seccion;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.PlantillaBaseRepository;
import com.backend.pymeweb.repositories.SeccionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class PlantillaServiceTest {

    @Mock
    private PlantillaBaseRepository plantillaBaseRepository;

    @Mock
    private SeccionRepository seccionRepository;

    @Mock
    private ConfiguracionWebRepository configuracionWebRepository;

    @InjectMocks
    private PlantillaService plantillaService;

    private Negocio negocio;
    private ConfiguracionWeb configuracionWeb;
    private PlantillaBase plantillaBase;

    @BeforeEach
    void setUp() {
        negocio = new Negocio();
        negocio.setIdNegocio(1L);
        negocio.setNombreNegocio("MascotasWeb");

        configuracionWeb = new ConfiguracionWeb();
        configuracionWeb.setIdConfiguracion(1L);

        plantillaBase = new PlantillaBase();
        // JSON minimo con una seccion de tipo CABECERA y el placeholder a reemplazar
        plantillaBase.setContenidoJson(
                "[{\"tipoSeccion\":\"CABECERA\",\"contenido\":{\"titulo\":\"Bienvenido a {{NOMBRE_NEGOCIO}}\"}}]"
        );
    }

    @Test
    void deberiaGenerarSeccionesCorrectamenteCuandoPlantillaYConfigExisten() {

        when(plantillaBaseRepository.findByTipoRubro("mascotas"))
                .thenReturn(Optional.of(plantillaBase));
        when(configuracionWebRepository.buscarPorIdNegocio(1L))
                .thenReturn(Optional.of(configuracionWeb));


        plantillaService.generarPlantillaInicial(negocio, "mascotas");


        ArgumentCaptor<List<Seccion>> captor = ArgumentCaptor.forClass(List.class);
        verify(seccionRepository, times(1)).saveAll(captor.capture());

        List<Seccion> seccionesGuardadas = captor.getValue();
        assertEquals(1, seccionesGuardadas.size());
        assertEquals("CABECERA", seccionesGuardadas.get(0).getTipoSeccion());
        assertTrue(seccionesGuardadas.get(0).getEsVisible());
        assertEquals(1, seccionesGuardadas.get(0).getOrden());
    }

    @Test
    void deberiaReemplazarPlaceholderConNombreDelNegocio() {
        when(plantillaBaseRepository.findByTipoRubro("mascotas"))
                .thenReturn(Optional.of(plantillaBase));
        when(configuracionWebRepository.buscarPorIdNegocio(1L))
                .thenReturn(Optional.of(configuracionWeb));

        plantillaService.generarPlantillaInicial(negocio, "mascotas");

        ArgumentCaptor<List<Seccion>> captor = ArgumentCaptor.forClass(List.class);
        verify(seccionRepository).saveAll(captor.capture());

        String contenidoGuardado = captor.getValue().get(0).getContenidoJson();
        assertTrue(contenidoGuardado.contains("MascotasWeb"),
                "El contenido debe contener el nombre real del negocio");
        assertFalse(contenidoGuardado.contains("{{NOMBRE_NEGOCIO}}"),
                "El placeholder no debe quedar sin reemplazar");
    }

    @Test
    void noDeberiaGuardarNadaCuandoNoExistePlantillaParaElRubro() {

        when(plantillaBaseRepository.findByTipoRubro("rubro-inexistente"))
                .thenReturn(Optional.empty());


        plantillaService.generarPlantillaInicial(negocio, "rubro-inexistente");


        verify(seccionRepository, never()).saveAll(any());
    }

    @Test
    void noDeberiaGuardarNadaCuandoNoExisteConfiguracionWebDelNegocio() {

        when(plantillaBaseRepository.findByTipoRubro("mascotas"))
                .thenReturn(Optional.of(plantillaBase));
        when(configuracionWebRepository.buscarPorIdNegocio(1L))
                .thenReturn(Optional.empty());


        plantillaService.generarPlantillaInicial(negocio, "mascotas");


        verify(seccionRepository, never()).saveAll(any());
    }

    @Test
    void deberiaManejarJsonMalFormadoSinLanzarExcepcionAlExterior() {

        PlantillaBase plantillaCorrupta = new PlantillaBase();
        plantillaCorrupta.setContenidoJson("{ esto no es un json valido ");

        when(plantillaBaseRepository.findByTipoRubro("mascotas"))
                .thenReturn(Optional.of(plantillaCorrupta));
        when(configuracionWebRepository.buscarPorIdNegocio(1L))
                .thenReturn(Optional.of(configuracionWeb));


        assertDoesNotThrow(() ->
                plantillaService.generarPlantillaInicial(negocio, "mascotas")
        );
        verify(seccionRepository, never()).saveAll(any());
    }
}