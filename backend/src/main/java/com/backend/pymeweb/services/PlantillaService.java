package com.backend.pymeweb.services;

import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.PlantillaBase;
import com.backend.pymeweb.models.Seccion;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.PlantillaBaseRepository;
import com.backend.pymeweb.repositories.SeccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

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

        PlantillaBase plantilla = plantillaBaseRepository.findByTipoRubro(tipoRubro.toLowerCase())
                .orElseGet(() -> plantillaBaseRepository.findByTipoRubro("generico")
                        .orElseThrow(() -> new RuntimeException("Error critico, no existe plantilla generica en la BD.")));

        ConfiguracionWeb config = configuracionWebRepository.buscarPorIdNegocio(negocio.getIdNegocio())
                .orElseGet(() -> {
                    ConfiguracionWeb nuevaConfig = new ConfiguracionWeb();
                    nuevaConfig.setNegocio(negocio);
                    return nuevaConfig;
                });
        configuracionWebRepository.save(config);

        try {
            ObjectMapper mapper = new ObjectMapper();

            List<Map<String, Object>> listaSecciones = mapper.readValue(
                    plantilla.getContenidoJson(),
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            List<Seccion> seccionesAGuardar = new ArrayList<>();
            int orden = 1;

            for (Map<String, Object> secData : listaSecciones){
                Seccion s = new Seccion();
                s.setConfiguracionWeb(config);
                s.setTipoSeccion((String) secData.get("tipoSeccion"));
                s.setOrden(orden++);
                s.setEsVisible(true);

                String contenidoInterior = mapper.writeValueAsString(secData.get("contenido"));

                contenidoInterior = contenidoInterior.replace("{{NOMBRE_NEGOCIO}}", negocio.getNombreNegocio());

                s.setContenidoJson(contenidoInterior);
                seccionesAGuardar.add(s);
            }

            seccionRepository.saveAll(seccionesAGuardar);
        } catch (Exception e) {
            System.err.println("Error al procesar el JSON de la plantilla: " + e.getMessage());
        }
    }
}
