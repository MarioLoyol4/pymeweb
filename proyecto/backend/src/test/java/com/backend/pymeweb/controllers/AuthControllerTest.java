package com.backend.pymeweb.controllers;

import com.backend.pymeweb.dto.AuthResponse;
import com.backend.pymeweb.dto.LoginRequest;
import com.backend.pymeweb.dto.RegistroRequest;
import com.backend.pymeweb.models.Negocio;
import com.backend.pymeweb.models.Usuario;
import com.backend.pymeweb.repositories.ConfiguracionWebRepository;
import com.backend.pymeweb.repositories.NegocioRepository;
import com.backend.pymeweb.repositories.UsuarioRepository;
import com.backend.pymeweb.security.JwtUtil;
import com.backend.pymeweb.services.PlantillaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para AuthController.
 * Dado que el proyecto no usa una capa Service intermedia para auth,
 * se prueba directamente el Controller mockeando sus repositorios
 * y colaboradores (AuthenticationManager, JwtUtil, PasswordEncoder).
 */
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsService userDetailsService;
    @Mock private JwtUtil jwtUtil;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private NegocioRepository negocioRepository;
    @Mock private ConfiguracionWebRepository configuracionWebRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private PlantillaService plantillaService;
    @Mock private UserDetails userDetails;

    @InjectMocks
    private AuthController authController;

    private RegistroRequest registroRequest;

    @BeforeEach
    void setUp() {
        registroRequest = new RegistroRequest();
        registroRequest.setEmail("test@correo.com");
        registroRequest.setPassword("123456");
        registroRequest.setNombreNegocio("Mascotas Web");
        registroRequest.setTipoRubro("mascotas");
    }

    // ---------- REGISTRO ----------

    @Test
    void deberiaRechazarRegistroSiElEmailYaExiste() {
        when(usuarioRepository.findByEmail("test@correo.com"))
                .thenReturn(Optional.of(new Usuario()));

        ResponseEntity<?> respuesta = authController.registrarUsuario(registroRequest);

        assertEquals(400, respuesta.getStatusCode().value());
        assertEquals("Error el email ya esta registrado.", respuesta.getBody());
        verify(negocioRepository, never()).save(any());
    }

    @Test
    void deberiaGenerarSlugCorrectoDesdeNombreConEspacios() {
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(negocioRepository.findBySlug(anyString())).thenReturn(Optional.empty());

        ResponseEntity<?> respuesta = authController.registrarUsuario(registroRequest);

        ArgumentCaptor<Negocio> captor = ArgumentCaptor.forClass(Negocio.class);
        verify(negocioRepository).save(captor.capture());

        assertEquals("mascotas-web", captor.getValue().getSlug());
        assertEquals(200, respuesta.getStatusCode().value());
    }

    @Test
    void deberiaAgregarNumeroAlSlugSiYaExisteUnoIgual() {
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        // El primer intento de slug "mascotas-web" ya existe, el segundo "mascotas-web-1" esta libre
        when(negocioRepository.findBySlug("mascotas-web")).thenReturn(Optional.of(new Negocio()));
        when(negocioRepository.findBySlug("mascotas-web-1")).thenReturn(Optional.empty());

        authController.registrarUsuario(registroRequest);

        ArgumentCaptor<Negocio> captor = ArgumentCaptor.forClass(Negocio.class);
        verify(negocioRepository).save(captor.capture());

        assertEquals("mascotas-web-1", captor.getValue().getSlug());
    }

    @Test
    void deberiaNormalizarTildesYNyEnElSlug() {
        registroRequest.setNombreNegocio("Peluquería Canína Ñuñoa");
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(negocioRepository.findBySlug(anyString())).thenReturn(Optional.empty());

        authController.registrarUsuario(registroRequest);

        ArgumentCaptor<Negocio> captor = ArgumentCaptor.forClass(Negocio.class);
        verify(negocioRepository).save(captor.capture());

        // sin tildes, sin "ñ", y con guiones en vez de espacios
        assertEquals("peluqueria-canina-nunoa", captor.getValue().getSlug());
    }

    @Test
    void deberiaInvocarGeneradorDePlantillaConElRubroCorrecto() {
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(negocioRepository.findBySlug(anyString())).thenReturn(Optional.empty());

        authController.registrarUsuario(registroRequest);

        verify(plantillaService, times(1))
                .generarPlantillaInicial(any(Negocio.class), eq("mascotas"));
    }

    // ---------- LOGIN ----------

    @Test
    void deberiaRetornar401SiLasCredencialesSonIncorrectas() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@correo.com");
        loginRequest.setPassword("incorrecta");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new RuntimeException("Bad credentials"));

        ResponseEntity<?> respuesta = authController.crearTokenAutenticacion(loginRequest);

        assertEquals(401, respuesta.getStatusCode().value());
        assertEquals("Credenciales incorrectas", respuesta.getBody());
    }

    @Test
    void deberiaRetornarJwtYSlugCuandoLoginEsExitoso() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@correo.com");
        loginRequest.setPassword("123456");

        Usuario usuario = new Usuario();
        usuario.setEmail("test@correo.com");

        Negocio negocio = new Negocio();
        negocio.setIdNegocio(5L);
        negocio.setSlug("mascotas-web");

        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userDetailsService.loadUserByUsername("test@correo.com")).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("test@correo.com");
        when(usuarioRepository.findByEmail("test@correo.com")).thenReturn(Optional.of(usuario));
        when(negocioRepository.findByUsuario(usuario)).thenReturn(Optional.of(negocio));
        when(jwtUtil.generateToken("test@correo.com", 5L)).thenReturn("token-falso-123");

        ResponseEntity<?> respuesta = authController.crearTokenAutenticacion(loginRequest);

        assertEquals(200, respuesta.getStatusCode().value());
        AuthResponse cuerpo = (AuthResponse) respuesta.getBody();
        assertNotNull(cuerpo);
        assertEquals("token-falso-123", cuerpo.getJwt());
        assertEquals("mascotas-web", cuerpo.getSlug());
    }

    @Test
    void deberiaLanzarExcepcionSiElUsuarioNoTieneNegocioAsociado() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@correo.com");
        loginRequest.setPassword("123456");

        Usuario usuario = new Usuario();

        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(userDetails);
        when(usuarioRepository.findByEmail(anyString())).thenReturn(Optional.of(usuario));
        when(negocioRepository.findByUsuario(usuario)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                authController.crearTokenAutenticacion(loginRequest)
        );
    }
}