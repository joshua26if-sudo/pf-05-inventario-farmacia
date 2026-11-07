const API_URL = "/api";

document.addEventListener("DOMContentLoaded", () => {
  cargarMedicamentos();
  cargarIndicador();
});

async function cargarMedicamentos() {
  try {
    const res = await fetch(`${API_URL}/medicamentos`);
    const listaMedicamentos = await res.json();

    const tbody = document.getElementById("tablaMedicamentos");
    const selectMov = document.getElementById("movMedicamentoId");

    tbody.replaceChildren();
    selectMov.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione un medicamento...";
    selectMov.appendChild(defaultOption);

    listaMedicamentos.forEach((m) => {
      const tr = document.createElement("tr");

      const campos = [m.id, m.codigo, m.nombre, m.categoria];
      campos.forEach((valor) => {
        const td = document.createElement("td");
        td.textContent = valor;
        tr.appendChild(td);
      });

      const tdStock = document.createElement("td");
      const strongStock = document.createElement("strong");
      strongStock.textContent = m.stockActual;

      if (m.stockActual <= m.stockMinimo) {
        strongStock.style.color = "#ef4444";
      } else {
        strongStock.style.color = "#10b981";
      }
      tdStock.appendChild(strongStock);
      tr.appendChild(tdStock);

      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = `Q${m.precioUnitario.toFixed(2)}`;
      tr.appendChild(tdPrecio);

      const tdFecha = document.createElement("td");
      tdFecha.textContent = m.fechaVencimiento;
      tr.appendChild(tdFecha);

      const tdAcciones = document.createElement("td");

      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Editar";
      btnEdit.className = "btn-editar";
      btnEdit.onclick = () => prepararEdicion(m);

      const btnDel = document.createElement("button");
      btnDel.textContent = "Desactivar";
      btnDel.className = "btn-eliminar";
      btnDel.onclick = () => desactivarMedicamento(m.id);

      tdAcciones.appendChild(btnEdit);
      tdAcciones.appendChild(btnDel);
      tr.appendChild(tdAcciones);

      tbody.appendChild(tr);

      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `${m.nombre} (Stock actual: ${m.stockActual})`;
      selectMov.appendChild(option);
    });
  } catch (error) {
    mostrarMensaje("Error al cargar los medicamentos", "error");
  }
}

async function cargarIndicador() {
  try {
    const res = await fetch(`${API_URL}/medicamentos/inventario/valor`);
    const valor = await res.json();
    document.getElementById("indicador").textContent =
      `Valor del Inventario: Q${valor.toFixed(2)}`;
  } catch (error) {
    document.getElementById("indicador").textContent =
      "Error al cargar indicador";
  }
}

document
  .getElementById("formMedicamento")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("medId").value;

    const body = {
      codigo: document.getElementById("medCodigo").value.trim(),
      nombre: document.getElementById("medNombre").value.trim(),
      categoria: document.getElementById("medCategoria").value.trim(),
      precioUnitario: parseFloat(document.getElementById("medPrecio").value),
      stockMinimo: parseInt(document.getElementById("medStockMin").value),
      fechaVencimiento: document.getElementById("medFecha").value,
    };

    const method = id ? "PUT" : "POST";
    const url = id
      ? `${API_URL}/medicamentos/${id}`
      : `${API_URL}/medicamentos`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        mostrarMensaje(
          id
            ? "Medicamento actualizado con éxito"
            : "Medicamento creado con éxito",
          "success",
        );
        limpiarFormularioMedicamento();
        cargarMedicamentos();
        cargarIndicador();
      } else {
        mostrarMensaje(
          data.mensaje || data.error || "Error al guardar el medicamento",
          "error",
        );
      }
    } catch (error) {
      mostrarMensaje("Error de conexión con el servidor", "error");
    }
  });

function prepararEdicion(m) {
  document.getElementById("tituloFormMed").textContent = "Editando Medicamento";
  document.getElementById("medId").value = m.id;
  document.getElementById("medCodigo").value = m.codigo;
  document.getElementById("medNombre").value = m.nombre;
  document.getElementById("medCategoria").value = m.categoria;
  document.getElementById("medPrecio").value = m.precioUnitario;
  document.getElementById("medStockMin").value = m.stockMinimo;
  document.getElementById("medFecha").value = m.fechaVencimiento;

  document.getElementById("btnGuardarMed").textContent = "Actualizar Cambios";
  document.getElementById("btnCancelarEdicion").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function limpiarFormularioMedicamento() {
  document.getElementById("formMedicamento").reset();
  document.getElementById("medId").value = "";
  document.getElementById("tituloFormMed").textContent =
    "Gestión de Medicamentos";
  document.getElementById("btnGuardarMed").textContent = "Guardar Medicamento";
  document.getElementById("btnCancelarEdicion").style.display = "none";
}

async function desactivarMedicamento(id) {
  if (
    !confirm(
      "¿Está seguro de desactivar este medicamento? No aparecerá en el listado.",
    )
  )
    return;
  try {
    const res = await fetch(`${API_URL}/medicamentos/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      mostrarMensaje("Medicamento desactivado correctamente", "success");
      cargarMedicamentos();
      cargarIndicador();
    } else {
      mostrarMensaje("No se pudo desactivar el medicamento", "error");
    }
  } catch (error) {
    mostrarMensaje("Error de conexión con el servidor", "error");
  }
}

document
  .getElementById("formMovimiento")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const medId = document.getElementById("movMedicamentoId").value;
    if (!medId) {
      mostrarMensaje("Por favor, seleccione un medicamento válido", "error");
      return;
    }

    const body = {
      medicamentoId: parseInt(medId),
      tipo: document.getElementById("movTipo").value,
      cantidad: parseInt(document.getElementById("movCantidad").value),
      motivo: document.getElementById("movMotivo").value.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/movimientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        mostrarMensaje(
          `Movimiento exitoso. Nuevo stock de ${data.medicamentoNombre}: ${data.stockResultante}`,
          "success",
        );
        document.getElementById("formMovimiento").reset();
        cargarMedicamentos();
        cargarIndicador();
      } else {
        mostrarMensaje(
          data.mensaje || "Error al registrar movimiento",
          "error",
        );
      }
    } catch (error) {
      mostrarMensaje("Error de conexión con el servidor", "error");
    }
  });

function mostrarMensaje(texto, tipo) {
  const div = document.getElementById("mensaje");
  div.textContent = texto;
  div.className = tipo;

  setTimeout(() => {
    div.className = "";
    div.textContent = "";
  }, 5000);
}
