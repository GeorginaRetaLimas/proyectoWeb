document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");
    
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        guardarProducto();
    });
});

function guardarProducto() {
    const nombre = document.getElementById("nombre");
    const categoria = document.getElementById("categoria");
    const imagen = document.getElementById("imagen");
    const precio = document.getElementById("precio");
    const stock = document.getElementById("stock");
    
    // Validaciones
    if (!nombre.value.trim() || !categoria.value.trim() || !imagen.value.trim() || !precio.value.trim() || !stock.value.trim()) {
        Swal.fire({
            icon: "warning",
            title: "Campos obligatorios",
            text: "Todos los campos deben estar completos."
        });
        return;
    }
    
    if (parseFloat(precio.value) <= 0 || parseInt(stock.value) < 0) {
        Swal.fire({
            icon: "error",
            title: "Valores no válidos",
            text: "El precio debe ser positivo y el stock no puede ser negativo."
        });
        return;
    }
    
    // Obtener productos del localStorage
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    
    // Crear nuevo producto
    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre.value.trim(),
        categoria: categoria.value,
        imagen: imagen.value.trim(),
        precio: parseFloat(precio.value),
        stock: parseInt(stock.value)
    };
    
    // Agregar a la lista
    productos.push(nuevoProducto);
    
    // Guardar en localStorage
    localStorage.setItem("productos", JSON.stringify(productos));
    
    // Mostrar modal de éxito
    Swal.fire({
        icon: "success",
        title: "¡Producto registrado!",
        text: "El producto se ha guardado correctamente."
    });
    
    // Limpiar formulario
    document.querySelector(".form").reset();
}