package com.umg.farmacia.service;

import com.umg.farmacia.dto.MedicamentoRequestDTO;
import com.umg.farmacia.entity.Medicamento;
import com.umg.farmacia.exception.BusinessException;
import com.umg.farmacia.exception.ResourceNotFoundException;
import com.umg.farmacia.repository.MedicamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicamentoService {

    @Autowired
    private MedicamentoRepository repo;

    public List<Medicamento> listarTodos() {
        return repo.findAll();
    }

    public Medicamento obtenerPorId(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + id));
    }

    public Medicamento crear(MedicamentoRequestDTO dto) {
        if (repo.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("Ya existe un medicamento con el código: " + dto.getCodigo());
        }

        Medicamento med = new Medicamento();
        med.setCodigo(dto.getCodigo());
        med.setNombre(dto.getNombre());
        med.setCategoria(dto.getCategoria());
        med.setPrecioUnitario(dto.getPrecioUnitario());
        med.setStockMinimo(dto.getStockMinimo());
        med.setFechaVencimiento(dto.getFechaVencimiento());
        med.setStockActual(0);
        med.setActivo(true);

        return repo.save(med);
    }

    public Medicamento actualizar(Long id, MedicamentoRequestDTO dto) {
        Medicamento med = obtenerPorId(id);

        if (!med.getCodigo().equals(dto.getCodigo()) && repo.existsByCodigo(dto.getCodigo())) {
            throw new BusinessException("El código " + dto.getCodigo() + " ya está en uso.");
        }

        med.setCodigo(dto.getCodigo());
        med.setNombre(dto.getNombre());
        med.setCategoria(dto.getCategoria());
        med.setPrecioUnitario(dto.getPrecioUnitario());
        med.setStockMinimo(dto.getStockMinimo());
        med.setFechaVencimiento(dto.getFechaVencimiento());

        return repo.save(med);
    }

    public void eliminar(Long id) {
        Medicamento med = obtenerPorId(id);
        med.setActivo(false);
        repo.save(med);
    }

    public List<Medicamento> buscarPorCategoria(String categoria) {
        return repo.findByCategoriaIgnoreCase(categoria);
    }

    public List<Medicamento> buscarStockBajo() {
        return repo.findAll().stream()
                .filter(m -> m.getStockActual() <= m.getStockMinimo())
                .toList();
    }
}
