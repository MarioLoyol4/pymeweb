package com.backend.pymeweb.controllers;

import com.backend.pymeweb.dto.AuthResponse;
import com.backend.pymeweb.dto.LoginRequest;
import com.backend.pymeweb.dto.RegistroRequest;
import com.backend.pymeweb.models.ConfiguracionWeb;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.Usuario;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.NegocioRepository;
import com.backend.pymeweb.repositories.UsuarioRepository;
import com.backend.pymeweb.security.JwtUtil;
import com.backend.pymeweb.services.PlantillaService; // <-- NUEVO IMPORT
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
    private ConfiguracionWebRepository configuracionWebRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 👇 INYECTAMOS NUESTRO SERVICIO ESTRELLA 👇
    @Autowired
    private PlantillaService plantillaService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequest request){
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Error el email ya esta registrado.");
        }

        // 1. Guardar Usuario
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setRol("ROL_USER");
        usuarioRepository.save(nuevoUsuario);

        // 2. Guardar Negocio
        Negocio nuevoNegocio = new Negocio();
        nuevoNegocio.setUsuario(nuevoUsuario);
        nuevoNegocio.setNombreNegocio(request.getNombreNegocio());
        nuevoNegocio.setTipoRubro(request.getTipoRubro());
        negocioRepository.save(nuevoNegocio);

        // 3. Crear ConfiguracionWeb básica
        ConfiguracionWeb configuracionWeb = new ConfiguracionWeb();
        configuracionWeb.setNegocio(nuevoNegocio);
        // Si ya no usas plantillaId, ponle algo por defecto o borra esta línea si no es obligatoria
        configuracionWeb.setTemaGlobal("default");
        configuracionWebRepository.save(configuracionWeb);

        // 4. ¡LLAMAR A LA MAGIA!
        // Le pasamos el negocio y la palabra que vino desde React (ej: "abogados")
        plantillaService.generarPlantillaInicial(nuevoNegocio, request.getTipoRubro());

        return ResponseEntity.ok("Usuario registrado exitosamente con el rubro " + request.getTipoRubro());
    }

    @PostMapping("/login")
    public ResponseEntity<?> crearTokenAutenticacion(@RequestBody LoginRequest request) throws Exception{
        // ... (Tu código de login se mantiene exactamente igual) ...
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Negocio negocio = negocioRepository.findByUsuario(usuario)
                .orElseThrow(() -> new RuntimeException("Este usuario no tiene un negocio asociado"));

        Long idDelNegocio = negocio.getIdNegocio();

        final String jwt = jwtUtil.generateToken(userDetails.getUsername(), idDelNegocio);

        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}