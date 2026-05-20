package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.RegistroContacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistroContactoRepository extends JpaRepository<RegistroContacto, Long> {
    List<RegistroContacto> findByNegocioIdNegocio(Long idNegocio);
}
