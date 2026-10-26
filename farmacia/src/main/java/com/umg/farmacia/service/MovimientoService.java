package com.umg.farmacia.service;

import com.umg.farmacia.dto.MovimientoRequestDTO;
import com.umg.farmacia.dto.MovimientoResponseDTO;
import com.umg.farmacia.entity.Medicamento;
import com.umg.farmacia.entity.MovimientoInventario;
import com.umg.farmacia.entity.TipoMovimiento;
import com.umg.farmacia.exception.BusinessException;
import com.umg.farmacia.exception.ResourceNotFoundException;
import com.umg.farmacia.repository.MedicamentoRepository;
import com.umg.farmacia.repository.MovimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovimientoService {

    @Autowired
    private MovimientoRepository movimientoRepo;

    @Autowired
    private MedicamentoRepository medicamentoRepo;

    @Transactional
    public MovimientoResponseDTO registrarMovimiento(MovimientoRequestDTO dto) {
        Medicamento med = medicamentoRepo.findById(dto.getMedicamentoId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + dto.getMedicamentoId()));

        if (!med.getActivo()) {
            throw new BusinessException("No se pueden registrar movimientos para un medicamento inactivo.");
        }

        int nuevoStock;

        if (dto.getTipo() == TipoMovimiento.ENTRADA) {
            nuevoStock = med.getStockActual() + dto.getCantidad();
        } else {
            if (dto.getCantidad() > med.getStockActual()) {
                throw new BusinessException("Stock insuficiente. Stock actual: " + med.getStockActual() + ", solicitado: " + dto.getCantidad());
            }
            nuevoStock = med.getStockActual() - dto.getCantidad();
        }

        med.setStockActual(nuevoStock);
        medicamentoRepo.save(med);

        MovimientoInventario mov = new MovimientoInventario();
        mov.setMedicamento(med);
        mov.setTipo(dto.getTipo());
        mov.setCantidad(dto.getCantidad());
        mov.setFecha(LocalDateTime.now());
        mov.setMotivo(dto.getMotivo());
        mov.setStockResultante(nuevoStock);

        MovimientoInventario guardado = movimientoRepo.save(mov);

        return mapToDTO(guardado);
    }

    public List<MovimientoResponseDTO> historialPorMedicamento(Long medicamentoId) {
        return movimientoRepo.findByMedicamentoIdOrderByFechaDesc(medicamentoId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private MovimientoResponseDTO mapToDTO(MovimientoInventario mov) {
        MovimientoResponseDTO dto = new MovimientoResponseDTO();
        dto.setId(mov.getId());
        dto.setMedicamentoId(mov.getMedicamento().getId());
        dto.setMedicamentoNombre(mov.getMedicamento().getNombre());
        dto.setTipo(mov.getTipo());
        dto.setCantidad(mov.getCantidad());
        dto.setFecha(mov.getFecha());
        dto.setMotivo(mov.getMotivo());
        dto.setStockResultante(mov.getStockResultante());
        return dto;
    }
}