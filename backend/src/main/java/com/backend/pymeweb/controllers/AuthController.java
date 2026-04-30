package com.backend.pymeweb.controllers;

import com.backend.pymeweb.dto.AuthResponse;
import com.backend.pymeweb.dto.LoginRequest;
import com.backend.pymeweb.dto.RegistroRequest;
import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.Seccion;
import com.backend.pymeweb.models.Usuario;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.NegocioRepository;
import com.backend.pymeweb.repositories.SeccionRepository;
import com.backend.pymeweb.repositories.UsuarioRepository;
import com.backend.pymeweb.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private NegocioRepository negocioRepository;

    @Autowired
    private SeccionRepository seccionRepository;

    @Autowired
    private ConfiguracionWebRepository configuracionWebRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequest request){
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Error el email ya esta registrado.");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setRol("ROL_USER");
        usuarioRepository.save(nuevoUsuario);

        Negocio nuevoNegocio = new Negocio();
        nuevoNegocio.setUsuario(nuevoUsuario);
        nuevoNegocio.setNombreNegocio(request.getNombreNegocio());
        nuevoNegocio.setTipoRubro(request.getTipoRubro());
        negocioRepository.save(nuevoNegocio);

        ConfiguracionWeb configuracionWeb = new ConfiguracionWeb();
        configuracionWeb.setNegocio(nuevoNegocio);
        configuracionWeb.setTemaGlobal(request.getPlantillaId());
        configuracionWebRepository.save(configuracionWeb);

        List<Seccion> seccionesAInsertar = new ArrayList<>();

        if ("classic".equalsIgnoreCase(request.getPlantillaId())){
            seccionesAInsertar = generarPlantillaClasica(configuracionWeb);
        } else if ("mordern".equalsIgnoreCase(request.getPlantillaId())) {
            seccionesAInsertar = generarPlantillaModerna(configuracionWeb);
        } else if ("rustic".equalsIgnoreCase(request.getPlantillaId())) {
            seccionesAInsertar = generarPlantillaRustica(configuracionWeb);
        }

        seccionRepository.saveAll(seccionesAInsertar);


        return ResponseEntity.ok("Usuario registrado exitosamente con la plantilla " + request.getPlantillaId());
    }

    // PLANTILLA 1: Abogados (Clásica y Formal)
    private List<Seccion> generarPlantillaClasica(ConfiguracionWeb configWeb) {
        List<Seccion> lista = new ArrayList<>();

        // 1. LOGO
        Seccion logo = new Seccion();
        logo.setConfiguracionWeb(configWeb);
        logo.setTipoSeccion("LOGO");
        logo.setOrden(1);
        logo.setEsVisible(true);
        logo.setContenidoJson("{\"tipo\":\"TEXTO\",\"texto\":\"Justicia & Asignados\"}");
        lista.add(logo);

        // 2. CABECERA
        Seccion cabecera = new Seccion();
        cabecera.setConfiguracionWeb(configWeb);
        cabecera.setTipoSeccion("CABECERA");
        cabecera.setOrden(2);
        cabecera.setEsVisible(true);
        cabecera.setContenidoJson("{\"titulo\":\"Asesoría Legal de Confianza\",\"subtitulo\":\"Defendemos sus derechos con profesionalismo, transparencia y años de experiencia en el rubro.\"}");
        lista.add(cabecera);

        // 3. CATÁLOGO (Usado aquí para listar Servicios Legales)
        Seccion catalogo = new Seccion();
        catalogo.setConfiguracionWeb(configWeb);
        catalogo.setTipoSeccion("SERVICIOS");
        catalogo.setOrden(3);
        catalogo.setEsVisible(true);
        // Listamos servicios en lugar de productos con precios
        catalogo.setContenidoJson("{\"productos\":[{\"nombre\":\"Derecho Civil\",\"descripcion\":\"Asesoría en contratos, herencias y demandas.\"},{\"nombre\":\"Derecho Laboral\",\"descripcion\":\"Defensa integral a trabajadores y empleadores.\"}]}");
        lista.add(catalogo);

        return lista;
    }

    // PLANTILLA 2: Tienda de Mascotas (Moderna y Cercana)
    private List<Seccion> generarPlantillaModerna(ConfiguracionWeb configWeb) {
        List<Seccion> lista = new ArrayList<>();

        // 1. LOGO
        Seccion logo = new Seccion();
        logo.setConfiguracionWeb(configWeb);
        logo.setTipoSeccion("LOGO");
        logo.setOrden(1);
        logo.setEsVisible(true);
        logo.setContenidoJson("{\"tipo\":\"TEXTO\",\"texto\":\"Huellas Felices\"}");
        lista.add(logo);

        // 2. CABECERA
        Seccion cabecera = new Seccion();
        cabecera.setConfiguracionWeb(configWeb);
        cabecera.setTipoSeccion("CABECERA");
        cabecera.setOrden(2);
        cabecera.setEsVisible(true);
        cabecera.setContenidoJson("{\"titulo\":\"Todo para tu mejor amigo\",\"subtitulo\":\"Encuentra el mejor alimento y accesorios para consentir a tus mascotas.\"}");
        lista.add(cabecera);

        // 3. CATÁLOGO (Informativo de productos destacados)
        Seccion catalogo = new Seccion();
        catalogo.setConfiguracionWeb(configWeb);
        catalogo.setTipoSeccion("PRODUCTOS");
        catalogo.setOrden(3);
        catalogo.setEsVisible(true);
        // Precios referenciales, sin botones de pago
        catalogo.setContenidoJson("{\"productos\":[{\"nombre\":\"Alimento Premium Perro 10kg\",\"precio\":\"$45.000\"},{\"nombre\":\"Juguete Rascador Gato\",\"precio\":\"$15.000\"}]}");
        lista.add(catalogo);

        return lista;
    }

    // PLANTILLA 3: Restaurante (Rústica y Gastronómica)
    private List<Seccion> generarPlantillaRustica(ConfiguracionWeb configWeb) {
        List<Seccion> lista = new ArrayList<>();

        // 1. LOGO
        Seccion logo = new Seccion();
        logo.setConfiguracionWeb(configWeb);
        logo.setTipoSeccion("LOGO");
        logo.setOrden(1);
        logo.setEsVisible(true);
        logo.setContenidoJson("{\"tipo\":\"TEXTO\",\"texto\":\"El Fogón Rústico\"}");
        lista.add(logo);

        // 2. CABECERA
        Seccion cabecera = new Seccion();
        cabecera.setConfiguracionWeb(configWeb);
        cabecera.setTipoSeccion("CABECERA");
        cabecera.setOrden(2);
        cabecera.setEsVisible(true);
        cabecera.setContenidoJson("{\"titulo\":\"Sabores de Casa\",\"subtitulo\":\"Disfruta de la mejor gastronomía tradicional en un ambiente acogedor y familiar.\"}");
        lista.add(cabecera);

        // 3. CATÁLOGO (La Carta / El Menú)
        Seccion catalogo = new Seccion();
        catalogo.setConfiguracionWeb(configWeb);
        catalogo.setTipoSeccion("PRODUCTOS");
        catalogo.setOrden(3);
        catalogo.setEsVisible(true);
        // Platos típicos listos para mostrarse en el frontend
        catalogo.setContenidoJson("{\"productos\":[{\"nombre\":\"Lomo a lo Pobre\",\"precio\":\"$12.500\"},{\"nombre\":\"Pastel de Choclo\",\"precio\":\"$9.900\"}]}");
        lista.add(catalogo);

        return lista;
    }


    

    @PostMapping("/login")
    public ResponseEntity<?> crearTokenAutenticacion(@RequestBody LoginRequest request) throws Exception{
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
