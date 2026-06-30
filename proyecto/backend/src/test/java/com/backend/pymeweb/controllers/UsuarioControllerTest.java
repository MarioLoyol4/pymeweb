package com.backend.pymeweb.controllers;

import com.backend.pymeweb.models.Usuario;
import com.backend.pymeweb.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioController usuarioController;

    @Test
    void deberiaRetornarListaVaciaCuandoNoHayUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Collections.emptyList());

        List<Usuario> resultado = usuarioController.listarUsuarios();

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void deberiaRetornarTodosLosUsuariosRegistrados() {
        Usuario u1 = new Usuario();
        u1.setEmail("uno@correo.com");
        Usuario u2 = new Usuario();
        u2.setEmail("dos@correo.com");

        when(usuarioRepository.findAll()).thenReturn(List.of(u1, u2));

        List<Usuario> resultado = usuarioController.listarUsuarios();

        assertEquals(2, resultado.size());
        assertEquals("uno@correo.com", resultado.get(0).getEmail());
    }

    @Test
    void deberiaGuardarYRetornarElUsuarioRegistrado() {
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setEmail("nuevo@correo.com");
        nuevoUsuario.setPassword("123456");

        when(usuarioRepository.save(nuevoUsuario)).thenReturn(nuevoUsuario);

        Usuario resultado = usuarioController.registrarUsuario(nuevoUsuario);

        assertNotNull(resultado);
        assertEquals("nuevo@correo.com", resultado.getEmail());
        verify(usuarioRepository, times(1)).save(nuevoUsuario);
    }
}