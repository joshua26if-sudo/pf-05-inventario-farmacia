package com.umg.farmacia.dto;

import com.umg.farmacia.entity.TipoMovimiento;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovimientoResponseDTO {
    private Long id;
    private Long medicamentoId;
    private String medicamentoNombre;
    private TipoMovimiento tipo;
    private Integer cantidad;
    private LocalDateTime fecha;
    private String motivo;
    private Integer stockResultante;
}