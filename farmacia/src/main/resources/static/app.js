const API_URL = "/api";
let listaMedicamentos = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarMedicamentos();
  cargarIndicador();
});

async function cargarMedicamentos() {
  try {
    const res = await fetch(`${API_URL}/medicamentos`);
    listaMedicamentos = await res.json();

    const tbody = document.getElementById("tablaMedicamentos");
    const selectMov = document.getElementById("movMedicamentoId");

    tbody.innerHTML = "";
    selectMov.innerHTML =
      '<option value="">Seleccione un medicamento...</option>';

    listaMedicamentos.forEach((m) => {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = m.id;
      const tdCodigo = document.createElement("td");
      tdCodigo.textContent = m.codigo;
      const tdNombre = document.createElement("td");
      tdNombre.textContent = m.nombre;
      const tdCat = document.createElement("td");
      tdCat.textContent = m.categoria;
      const tdStock = document.createElement("td");
      tdStock.innerHTML = `<b>${m.stockActual}</b>`;
      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = `Q${m.precioUnitario.toFixed(2)}`;

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

      tr.appendChild(tdId);
      tr.appendChild(tdCodigo);
      tr.appendChild(tdNombre);
      tr.appendChild(tdCat);
      tr.appendChild(tdStock);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdAcciones);
      tbody.appendChild(tr);

      const option = document.createElement("option");
      option.value = m.id;
      option.textContent = `${m.nombre} (Stock: ${m.stockActual})`;
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
      codigo: document.getElementById("medCodigo").value,
      nombre: document.getElementById("medNombre").value,
      categoria: document.getElementById("medCategoria").value,
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
          id ? "Medicamento actualizado" : "Medicamento creado",
          "success",
        );
        limpiarFormularioMedicamento();
        cargarMedicamentos();
        cargarIndicador();
      } else {
        mostrarMensaje(
          data.mensaje || data.error || "Error al guardar",
          "error",
        );
      }
    } catch (error) {
      mostrarMensaje("Error de conexión", "error");
    }
  });

function prepararEdicion(m) {
  document.getElementById("medId").value = m.id;
  document.getElementById("medCodigo").value = m.codigo;
  document.getElementById("medNombre").value = m.nombre;
  document.getElementById("medCategoria").value = m.categoria;
  document.getElementById("medPrecio").value = m.precioUnitario;
  document.getElementById("medStockMin").value = m.stockMinimo;
  document.getElementById("medFecha").value = m.fechaVencimiento;

  document.getElementById("btnGuardarMed").textContent =
    "Actualizar Medicamento";
  document.getElementById("btnCancelarEdicion").style.display = "block";
  window.scrollTo(0, 0);
}

function limpiarFormularioMedicamento() {
  document.getElementById("formMedicamento").reset();
  document.getElementById("medId").value = "";
  document.getElementById("btnGuardarMed").textContent = "Guardar Medicamento";
  document.getElementById("btnCancelarEdicion").style.display = "none";
}

async function desactivarMedicamento(id) {
  if (!confirm("¿Está seguro de desactivar este medicamento?")) return;
  try {
    const res = await fetch(`${API_URL}/medicamentos/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      mostrarMensaje("Medicamento desactivado", "success");
      cargarMedicamentos();
      cargarIndicador();
    } else {
      mostrarMensaje("No se pudo desactivar", "error");
    }
  } catch (error) {
    mostrarMensaje("Error de conexión", "error");
  }
}

document
  .getElementById("formMovimiento")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      medicamentoId: parseInt(
        document.getElementById("movMedicamentoId").value,
      ),
      tipo: document.getElementById("movTipo").value,
      cantidad: parseInt(document.getElementById("movCantidad").value),
      motivo: document.getElementById("movMotivo").value,
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
          `Movimiento registrado. Nuevo stock: ${data.stockResultante}`,
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
      mostrarMensaje("Error de conexión", "error");
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
