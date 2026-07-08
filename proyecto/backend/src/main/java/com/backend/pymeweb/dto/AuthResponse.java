package com.backend.pymeweb.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String slug;

    public AuthResponse(String jwt, String slug)
    {
        this.jwt = jwt;
        this.slug = slug;
    }
}
