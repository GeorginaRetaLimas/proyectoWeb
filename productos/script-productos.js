document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  const nombre = document.getElementById("nombre");
  const categoria = document.getElementById("categoria");
  const imagen = document.getElementById("imagen");
  const precio = document.getElementById("precio");
  const stock = document.getElementById("stock");

  // Escuchar el evento de envío
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // --- Validaciones ---
    if (
      !nombre.value.trim() ||
      !categoria.value.trim() ||
      !imagen.value.trim() ||
      !precio.value.trim() ||
      !stock.value.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Todos los campos deben estar completos.",
      });
      return;
    }

    if (parseFloat(precio.value) <= 0 || parseInt(stock.value) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Valores no válidos",
        text: "El precio y el stock deben ser números positivos.",
      });
      return;
    }

    // --- Crear el objeto producto ---
    const producto = {
      id: Date.now(),
      nombre: nombre.value.trim(),
      categoria: categoria.value,
      imagen: imagen.value.trim(),
      precio: parseFloat(precio.value),
      stock: parseInt(stock.value),
    };

    // --- Guardar en localStorage ---
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));

    // --- Mostrar confirmación ---
    Swal.fire({
      icon: "success",
      title: "¡Producto registrado!",
      text: "El producto se ha guardado correctamente.",
    });

    // --- Limpiar formulario ---
    form.reset();
  });
});
