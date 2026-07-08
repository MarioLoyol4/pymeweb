package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.Seccion;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.NegocioRepository;
import com.backend.pymeweb.repositories.SeccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/secciones")
public class SeccionController {

    @Autowired
    private SeccionRepository seccionRepository;

    @Autowired
    private ConfiguracionWebRepository configuracionWebRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @PostMapping("/negocio/{idNegocio}")
    public ResponseEntity<?> crearSeccionParaNegocio(@PathVariable Long idNegocio,@RequestBody Seccion nuevaSeccion){
        Optional<ConfiguracionWeb> configOpt = configuracionWebRepository.buscarPorIdNegocio(idNegocio);

        if (configOpt.isEmpty()){
            return ResponseEntity.badRequest().body("Error el negocio no tiene una configuracion web asignada.");
        }

        nuevaSeccion.setConfiguracionWeb(configOpt.get());

        Seccion seccionGuardada = seccionRepository.save(nuevaSeccion);

        return ResponseEntity.ok(seccionGuardada);
    }

    @PostMapping("/configuracion/{idConfiguracion}")
    public ResponseEntity<?> crearSeccion(@PathVariable Long idConfiguracion, @RequestBody Seccion nuevaSeccion){

        Optional<ConfiguracionWeb> configDb = configuracionWebRepository.findById(idConfiguracion);

        if (configDb.isPresent()) {
            nuevaSeccion.setConfiguracionWeb(configDb.get());
            Seccion seccionGuardada = seccionRepository.save(nuevaSeccion);
            return ResponseEntity.ok(seccionGuardada);
        } else {
            return ResponseEntity.badRequest().body("Error: No se encontro la configuracion con ID " + idConfiguracion);
        }
    }

    @GetMapping("/configuracion/{idConfiguracion}")
    public ResponseEntity<List<Seccion>> listarSeccionesPorConfig(@PathVariable Long idConfiguracion){
        return ResponseEntity.ok(seccionRepository.findAll());
    }

    //  PUT edita la seccion especifica
    @PutMapping("/{idSeccion}")
    public ResponseEntity<?> editarSeccion(@PathVariable Long idSeccion, @RequestBody Seccion seccionActualizada){
        return seccionRepository.findById(idSeccion)
                .map(seccion -> {
                    seccion.setTipoSeccion(seccionActualizada.getTipoSeccion());
                    seccion.setOrden(seccionActualizada.getOrden());
                    seccion.setContenidoJson(seccionActualizada.getContenidoJson());
                    seccion.setEsVisible(seccionActualizada.getEsVisible());
                    Seccion guardada = seccionRepository.save(seccion);
                    return ResponseEntity.ok(guardada);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    //  DELETE elimina la seccion por id
    @DeleteMapping("/{idSeccion}")
    public ResponseEntity<?> eliminarSeccion(@PathVariable Long idSeccion) {

//      Se verifica que la seccion exista, se busca por id
        if (seccionRepository.existsById(idSeccion)) {
//          al verificar que existe, se borra
            seccionRepository.deleteById(idSeccion);
            return ResponseEntity.ok().body("Seccion eliminada correctamente");
        } else {
//          Si no existe se manda un error 404 not found
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/negocio/slug/{slug}")
    public ResponseEntity<List<Seccion>> obtenerSeccionesPorSlug(@PathVariable String slug) {
        Negocio negocio = negocioRepository.findBySlug(slug).orElse(null);
        if (negocio == null) {
            return ResponseEntity.notFound().build();
        }
        List<Seccion> secciones = seccionRepository.obtenerSeccionesPorNegocio(negocio.getIdNegocio());
        if (secciones.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(secciones);
    }

    @GetMapping("/negocio/{idNegocio}")
    public ResponseEntity<List<Seccion>> obtenerSeccionesPorNegocio(@PathVariable Long idNegocio){
        List<Seccion> secciones = seccionRepository.obtenerSeccionesPorNegocio(idNegocio);

        if (secciones.isEmpty()){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(secciones);
    }
}