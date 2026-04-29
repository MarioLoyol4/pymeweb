package com.backend.pymeweb.repositories;

import com.backend.pymeweb.models.ConfiguracionWeb;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfiguracionWebRepository extends JpaRepository<ConfiguracionWeb, Long> {
}
