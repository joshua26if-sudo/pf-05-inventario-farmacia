package com.umg.farmacia.controller;

import com.umg.farmacia.entity.Medicamento;
import com.umg.farmacia.service.MedicamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/medicamentos")
public class MedicamentoController {

    @Autowired
    private MedicamentoService medicamentoService;

    @GetMapping
    public List<Medicamento> listar() {
        return medicamentoService.listarTodos();
    }
}