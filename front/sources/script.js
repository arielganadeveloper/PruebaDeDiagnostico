document
  .getElementById("guardarBtn")
  .addEventListener("click", guardarProducto);
window.addEventListener("DOMContentLoaded", cargarDatosIniciales);

// Función principal que se ejecuta al guardar
function guardarProducto() {
  const codigo = document.getElementById("codigo").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const bodega = document.getElementById("bodega").value;
  const sucursal = document.getElementById("sucursal").value;
  const moneda = document.getElementById("moneda").value;
  const precio = document.getElementById("precio").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const materiales = [
    ...document.querySelectorAll('input[name="material[]"]:checked'),
  ].map((m) => m.value);

  if (
    !validarProducto(
      codigo,
      nombre,
      bodega,
      sucursal,
      moneda,
      precio,
      descripcion,
      materiales
    )
  )
    return;

  if (!validarCodigoExiste(codigo)) return;

  enviarProducto({
    codigo,
    nombre,
    bodega,
    sucursal,
    moneda,
    precio,
    descripcion,
    materiales,
  });
}

// Validaciones generales
function validarProducto(
  codigo,
  nombre,
  bodega,
  sucursal,
  moneda,
  precio,
  descripcion,
  materiales
) {
  if (
    codigo === "" ||
    codigo.length < 5 ||
    codigo.length > 15 ||
    !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,15}$/.test(codigo)
  ) {
    alert(
      "Código inválido. Debe tener entre 5 y 15 caracteres, contener letras y números."
    );
    return false;
  }

  if (nombre === "" || nombre.length < 2 || nombre.length > 50) {
    alert("El nombre debe tener entre 2 y 50 caracteres.");
    return false;
  }

  if (bodega === "") {
    alert("Debe seleccionar una bodega.");
    return false;
  }

  if (sucursal === "") {
    alert("Debe seleccionar una sucursal para la bodega.");
    return false;
  }

  if (moneda === "") {
    alert("Debe seleccionar una moneda.");
    return false;
  }

  if (precio === "" || !/^\d+(\.\d{1,2})?$/.test(precio)) {
    alert("El precio debe ser un número positivo con hasta 2 decimales.");
    return false;
  }

  if (materiales.length < 2) {
    alert("Debe seleccionar al menos dos materiales.");
    return false;
  }

  if (
    descripcion === "" ||
    descripcion.length < 10 ||
    descripcion.length > 1000
  ) {
    alert("La descripción debe tener entre 10 y 1000 caracteres.");
    return false;
  }

  return true;
}

// Validar si ya existe el código (síncrono)
function validarCodigoExiste(codigo) {
  const xhrCheck = new XMLHttpRequest();
  xhrCheck.open("POST", "../BackEnd/validacion.php", false); // síncrono
  xhrCheck.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  xhrCheck.send("codigo=" + encodeURIComponent(codigo));

  if (xhrCheck.responseText === "existe") {
    alert("El código del producto ya está registrado.");
    return false;
  }

  return true;
}

// Enviar producto por AJAX
function enviarProducto({
  codigo,
  nombre,
  bodega,
  sucursal,
  moneda,
  precio,
  descripcion,
  materiales,
}) {
  const datos = new FormData();
  datos.append("codigo", codigo);
  datos.append("nombre", nombre);
  datos.append("bodega", bodega);
  datos.append("sucursal", sucursal);
  datos.append("moneda", moneda);
  datos.append("precio", precio);
  datos.append("descripcion", descripcion);
  materiales.forEach((m) => datos.append("material[]", m));

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "../BackEnd/guardar.php", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      alert("Producto ingresado con éxito.");
      document.getElementById("formProducto").reset();
    } else {
      alert("Error al guardar el producto.");
    }
  };
  xhr.send(datos);
}

// Cargar bodegas, monedas y manejar sucursales
function cargarDatosIniciales() {
  cargarSelect("../BackEnd/datos_dinamicos.php?tabla=bodegas", "bodega");
  cargarSelect("../BackEnd/datos_dinamicos.php?tabla=monedas", "moneda");

  document
    .getElementById("bodega")
    .addEventListener("change", cargarSucursales);
}

// Función reutilizable para cargar select
function cargarSelect(url, selectId) {
  fetch(url)
    .then((res) => res.text())
    .then((text) => {
      try {
        const data = JSON.parse(text);
        const select = document.getElementById(selectId);
        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.nombre;
          select.appendChild(option);
        });
      } catch (e) {
        console.error(`Error cargando ${selectId}:`, e);
      }
    });
}

// Cargar sucursales al cambiar bodega
function cargarSucursales() {
  const bodegaId = this.value;
  const sucursalSelect = document.getElementById("sucursal");
  sucursalSelect.innerHTML = '<option value=""></option>';

  if (bodegaId !== "") {
    fetch(
      `../BackEnd/datos_dinamicos.php?tabla=sucursales&bodega_id=${bodegaId}`
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.nombre;
          sucursalSelect.appendChild(option);
        });
      });
  }
}
