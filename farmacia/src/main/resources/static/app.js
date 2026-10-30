const API_URL = "/api";

document.addEventListener("DOMContentLoaded", () => {
  cargarMedicamentos();
  cargarIndicador();
});

async function cargarMedicamentos() {
  try {
    const res = await fetch(`${API_URL}/medicamentos`);
    const data = await res.json();
    const tbody = document.getElementById("tablaMedicamentos");
    tbody.innerHTML = "";
    data.forEach((m) => {
      tbody.innerHTML += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.codigo}</td>
                    <td>${m.nombre}</td>
                    <td>${m.categoria}</td>
                    <td><b>${m.stockActual}</b></td>
                    <td>Q${m.precioUnitario.toFixed(2)}</td>
                </tr>
            `;
    });
  } catch (error) {
    mostrarMensaje("Error al cargar los medicamentos", "error");
  }
}

async function cargarIndicador() {
  try {
    const res = await fetch(`${API_URL}/medicamentos/inventario/valor`);
    const valor = await res.json();
    document.getElementById("indicador").innerText =
      `Valor del Inventario: Q${valor.toFixed(2)}`;
  } catch (error) {
    document.getElementById("indicador").innerText =
      "Error al cargar indicador";
  }
}

document
  .getElementById("formMovimiento")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = {
      medicamentoId: document.getElementById("medicamentoId").value,
      tipo: document.getElementById("tipoMovimiento").value,
      cantidad: document.getElementById("cantidad").value,
      motivo: document.getElementById("motivo").value,
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
      mostrarMensaje("Error de conexión con el servidor", "error");
    }
  });

function mostrarMensaje(texto, tipo) {
  const div = document.getElementById("mensaje");
  div.innerText = texto;
  div.className = tipo;
  setTimeout(() => {
    div.className = "";
    div.innerText = "";
  }, 4000);
}
