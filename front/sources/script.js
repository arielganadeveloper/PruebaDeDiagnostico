document.getElementById("guardarBtn").addEventListener("click", function () {
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

  // Validar Código del Producto
  if (codigo === "") {
    alert("El código del producto no puede estar en blanco.");
    return;
  }
  if (codigo.length < 5 || codigo.length > 500) {
    alert("El código del producto debe tener entre 5 y 15 caracteres.");
    return;
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,15}$/.test(codigo)) {
    alert("El código del producto debe contener letras y números.");
    return;
  }
  // termino de funcion de validacion del producto

  // Validar si el código ya existe
  const xhrCheck = new XMLHttpRequest();

  xhrCheck.open("POST", "../back/validacion.php", false); // síncrono para validación previa
  xhrCheck.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  xhrCheck.send("codigo=" + encodeURIComponent(codigo));
  if (xhrCheck.responseText === "existe") {
    alert("El código del producto ya está registrado.");
    return;
  }
  // termino de validacion de codigo

  // Validar Nombre
  if (nombre === "") {
    alert("El nombre del producto no puede estar en blanco.");
    return;
  }
  if (nombre.length < 2 || nombre.length > 50) {
    alert("El nombre del producto debe tener entre 2 y 50 caracteres.");
    return;
  }

  // Validar Bodega
  if (bodega === "") {
    alert("Debe seleccionar una bodega.");
    return;
  }

  // Validar Sucursal
  if (sucursal === "") {
    alert("Debe seleccionar una sucursal para la bodega seleccionada.");
    return;
  }

  // Validar Moneda
  if (moneda === "") {
    alert("Debe seleccionar una moneda para el producto.");
    return;
  }

  // Validar Precio
  if (precio === "") {
    alert("El precio del producto no puede estar en blanco.");
    return;
  }
  //validar numero positvo con hasta 2 decimales
  if (!/^\d+(\.\d{1,2})?$/.test(precio)) {
    alert(
      "El precio del producto debe ser un número positivo con hasta dos decimales."
    );
    return;
  }

  // Validar Materiales
  if (materiales.length < 2) {
    alert("Debe seleccionar al menos dos materiales para el producto.");
    return;
  }

  // Validar Descripción
  if (descripcion === "") {
    alert("La descripción del producto no puede estar en blanco.");
    return;
  }
  // validar largo de la descripcion
  if (descripcion.length < 10 || descripcion.length > 1000) {
    alert("La descripción del producto debe tener entre 10 y 1000 caracteres.");
    return;
  }

  // enviar por AJAX
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
  xhr.open("POST", "../back/guardar.php", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      alert("Producto ingresado con exito");
      document.getElementById("formProducto").reset();
    } else {
      alert("Error al guardar el producto.");
    }
  };
  xhr.send(datos);
});
window.addEventListener("DOMContentLoaded", () => {
  // Cargar bodegas dinamicamente
  fetch("../back/datos_dinamicos.php?tabla=bodegas")
    .then((res) => res.text()) // 👈 Cambia a .text() primero
    .then((text) => {
      console.log("Respuesta bodegas:", text); // 👈 Ve qué estás recibiendo
      try {
        const data = JSON.parse(text); // 👈 Intenta parsear
        const select = document.getElementById("bodega");
        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.nombre;
          select.appendChild(option);
        });
      } catch (e) {
        console.error("JSON inválido en bodegas:", e);
      }
    });

  // Cargar monedas
  fetch("../back/datos_dinamicos.php?tabla=monedas")
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("moneda");
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.nombre;
        select.appendChild(option);
      });
    });

  // Cargar sucursales al seleccionar bodega
  document.getElementById("bodega").addEventListener("change", function () {
    const bodegaId = this.value;
    const sucursalSelect = document.getElementById("sucursal");

    // Reset sucursales
    sucursalSelect.innerHTML = '<option value=""></option>';

    if (bodegaId !== "") {
      fetch(
        `../back/datos_dinamicos.php?tabla=sucursales&bodega_id=${bodegaId}`
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
  });
});
