package com.backend.pymeweb.dto;

import lombok.Data;

@Data
public class RegistroRequest {
    private String email;
    private String password;
    private String nombreNegocio;
    private String tipoRubro;
    private String plantillaId;
}
