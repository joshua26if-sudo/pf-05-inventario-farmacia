package com.umg.farmacia.repository;

import com.umg.farmacia.entity.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MovimientoRepository extends JpaRepository<MovimientoInventario, Long> {
    List<MovimientoInventario> findByMedicamentoIdOrderByFechaDesc(Long medicamentoId);
}