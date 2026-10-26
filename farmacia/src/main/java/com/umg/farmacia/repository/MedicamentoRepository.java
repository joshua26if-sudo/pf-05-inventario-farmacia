package com.umg.farmacia.repository;

import com.umg.farmacia.entity.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Long>
{
    boolean existsByCodigo(String codigo);
    List<Medicamento> findByCategoriaIgnoreCase(String categoria);
    List<Medicamento> findByStockActualLessThanEqual(Integer stock);
}