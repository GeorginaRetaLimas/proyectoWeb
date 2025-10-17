// Variable global para almacenar el ID del producto que se va a eliminar
let productoAEliminar = null;

// Ejecuta cargarProductos cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

// Obtiene los productos del localStorage, limpia el contenedor y genera las tarjetas
function cargarProductos() {
    // Obtiene el array de productos desde localStorage, si no existe retorna un array vacío
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    
    // Obtiene el elemento contenedor donde se mostrarán las tarjetas
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<div class="vacio">No hay productos registrados</div>';
        return;
    }
    
    // Recorre cada producto y crea una tarjeta para cada uno
    productos.forEach(producto => {
        const tarjeta = crearTarjeta(producto);
        contenedor.appendChild(tarjeta);
    });
}

// Crea un elemento HTML con la estructura de la tarjeta del producto
function crearTarjeta(producto) {
    // Crea un div que será la tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    
    // Rellena la tarjeta con HTML que contiene la imagen, nombre, categoría, precio, stock y botones
    tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-producto" onerror="this.src='https://via.placeholder.com/300x220?text=Imagen+no+disponible'">
        <div class="contenido-tarjeta">
            <div class="nombre-producto">${producto.nombre}</div>
            <div class="info-producto"><strong>Categoría:</strong> ${producto.categoria}</div>
            <div class="precio">$${producto.precio.toFixed(2)}</div>
            <div class="stock">Stock: ${producto.stock} unidades</div>
            <div class="botones">
                <button class="btn-editar" onclick="abrirEdicion(${producto.id})">Editar</button>
                <button class="btn-eliminar" onclick="abrirModalEliminacion(${producto.id})">Eliminar</button>
            </div>
        </div>
    `;
    
    return tarjeta;
}

// Redirige al formulario de registro para agregar un nuevo producto
function abrirFormulario() {
    window.location.href = "registroProduct.html";
}

// Busca el producto por ID, lo guarda en localStorage y redirige al formulario en modo edición
function abrirEdicion(id) {
    // Obtiene todos los productos del localStorage
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    
    // Busca el producto que tiene el ID especificado
    const producto = productos.find(p => p.id === id);
    
    // Si encuentra el producto, lo guarda y redirige
    if (producto) {
        localStorage.setItem("productoEnEdicion", JSON.stringify(producto));
        window.location.href = "registroProduct.html?editar=" + id;
    }
}

// Abre el modal de confirmación para eliminar un producto
function abrirModalEliminacion(id) {
    // Guarda el ID del producto a eliminar
    productoAEliminar = id;
    
    // Muestra el modal agregando la clase "activo"
    document.getElementById("modal-eliminar").classList.add("activo");
}

// Cierra el modal de eliminación y limpia la variable
function cerrarModal() {
    // Oculta el modal removiendo la clase "activo"
    document.getElementById("modal-eliminar").classList.remove("activo");
    
    // Limpia la variable del producto a eliminar
    productoAEliminar = null;
}

// Elimina el producto del localStorage, cierra el modal y recarga la galería
function confirmarEliminacion() {
    // Verifica que haya un producto seleccionado para eliminar
    if (productoAEliminar === null) return;
    
    // Obtiene todos los productos del localStorage
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    
    // Filtra el array eliminando el producto que tiene el ID seleccionado
    productos = productos.filter(p => p.id !== productoAEliminar);
    
    // Guarda el array actualizado sin el producto eliminado
    localStorage.setItem("productos", JSON.stringify(productos));
    
    // Cierra el modal
    cerrarModal();
    
    // Recarga las tarjetas para mostrar la galería actualizada
    cargarProductos();
    
    // Muestra un mensaje de éxito
    Swal.fire({
        icon: "success",
        title: "¡Producto eliminado!",
        text: "El producto se ha eliminado correctamente."
    });
}

// Cierra el modal si el usuario hace clic fuera de él
document.addEventListener("click", (event) => {
    const modal = document.getElementById("modal-eliminar");
    
    // Si el clic fue en el fondo del modal lo cierra
    if (event.target === modal) {
        cerrarModal();
    }
});