package com.backend.pymeweb.services;

import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.PlantillaBase;
import com.backend.pymeweb.models.Seccion;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.PlantillaBaseRepository;
import com.backend.pymeweb.repositories.SeccionRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PlantillaService {

    @Autowired
    private PlantillaBaseRepository plantillaBaseRepository;

    @Autowired
    private SeccionRepository seccionRepository;

    @Autowired
    private ConfiguracionWebRepository configuracionWebRepository;

    public void generarPlantillaInicial(Negocio negocio, String tipoRubro) {
        try {

            PlantillaBase plantilla = plantillaBaseRepository.findByTipoRubro(tipoRubro)
                    .orElseThrow(() -> new RuntimeException("No hay plantilla para: " + tipoRubro));


            ConfiguracionWeb config = configuracionWebRepository.buscarPorIdNegocio(negocio.getIdNegocio())
                    .orElseThrow(() -> new RuntimeException("Configuracion web no encontrada"));

            ObjectMapper mapper = new ObjectMapper();
            String jsonCrudo = plantilla.getContenidoJson();


            if (jsonCrudo.startsWith("\"") && jsonCrudo.endsWith("\"")) {
                jsonCrudo = jsonCrudo.substring(1, jsonCrudo.length() - 1);
                jsonCrudo = jsonCrudo.replace("\\\"", "\"");
            }


            List<Map<String, Object>> seccionesBase = mapper.readValue(
                    jsonCrudo,
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            List<Seccion> seccionesAInsertar = new ArrayList<>();
            int orden = 1;


            for (Map<String, Object> base : seccionesBase) {
                Seccion nuevaSeccion = new Seccion();
                nuevaSeccion.setConfiguracionWeb(config);
                nuevaSeccion.setTipoSeccion((String) base.get("tipoSeccion"));
                nuevaSeccion.setOrden(orden++);
                nuevaSeccion.setEsVisible(true);


                Object contenidoObj = base.get("contenido");
                String contenidoString = mapper.writeValueAsString(contenidoObj);


                contenidoString = contenidoString.replace("{{NOMBRE_NEGOCIO}}", negocio.getNombreNegocio());

                nuevaSeccion.setContenidoJson(contenidoString);
                seccionesAInsertar.add(nuevaSeccion);
            }

            // 6. ¡GUARDAR TODO EN LA BASE DE DATOS!
            seccionRepository.saveAll(seccionesAInsertar);
            System.out.println("Plantilla generada con éxito para el negocio: " + negocio.getNombreNegocio());

        } catch (Exception e) {
            System.err.println("Error al procesar la plantilla: " + e.getMessage());
            e.printStackTrace();
        }
    }
}