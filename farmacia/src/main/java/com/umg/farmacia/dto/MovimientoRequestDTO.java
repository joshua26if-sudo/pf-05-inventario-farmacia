package com.umg.farmacia.dto;

import com.umg.farmacia.entity.TipoMovimiento;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MovimientoRequestDTO {

    @NotNull(message = "El ID del medicamento es obligatorio")
    private Long medicamentoId;

    @NotNull(message = "El tipo de movimiento es obligatorio")
    private TipoMovimiento tipo;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a cero")
    private Integer cantidad;

    private String motivo;
}