package com.umg.farmacia.controller;

import com.umg.farmacia.dto.MovimientoRequestDTO;
import com.umg.farmacia.dto.MovimientoResponseDTO;
import com.umg.farmacia.service.MovimientoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    @Autowired
    private MovimientoService service;

    @PostMapping
    public ResponseEntity<MovimientoResponseDTO> registrar(@Valid @RequestBody MovimientoRequestDTO dto) {
        return new ResponseEntity<>(service.registrarMovimiento(dto), HttpStatus.CREATED);
    }

    @GetMapping("/medicamento/{id}")
    public List<MovimientoResponseDTO> historial(@PathVariable Long id) {
        return service.historialPorMedicamento(id);
    }
}