package com.umg.farmacia.controller;

import com.umg.farmacia.dto.MedicamentoRequestDTO;
import com.umg.farmacia.entity.Medicamento;
import com.umg.farmacia.service.MedicamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {

    @Autowired
    private MedicamentoService service;

    @GetMapping
    public List<Medicamento> listar() { return service.listarTodos(); }

    @GetMapping("/{id}")
    public Medicamento obtener(@PathVariable Long id) { return service.obtenerPorId(id); }

    @PostMapping
    public ResponseEntity<Medicamento> crear(@Valid @RequestBody MedicamentoRequestDTO dto) {
        return new ResponseEntity<>(service.crear(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Medicamento actualizar(@PathVariable Long id, @Valid @RequestBody MedicamentoRequestDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categoria/{categoria}")
    public List<Medicamento> porCategoria(@PathVariable String categoria) {
        return service.buscarPorCategoria(categoria);
    }

    @GetMapping("/stock-bajo")
    public List<Medicamento> stockBajo() {
        return service.buscarStockBajo();
    }
}