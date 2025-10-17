// Variable global para almacenar el ID del producto que se va a eliminar
let productoAEliminar = null;

let productos = [];

// Ejecuta cargarProductos cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

// Obtiene los productos del localStorage, limpia el contenedor y genera las tarjetas
function cargarProductos() {
    // Obtiene el array de productos desde localStorage, si no existe retorna un array vacío
    productos = JSON.parse(localStorage.getItem("productos")) || [];
    
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

/* Parte de Gina pero si truena ya no es Gina jssjshsbsjss */

// Función para buscar un producto
function buscarProductos(){
    // Obtenemos lo que este en el input de buscar y lo hacemos minusculas
    const busqueda = document.getElementById("buscar").value.toLowerCase().trim();

    // Obtenemos la categoria que este seleccionada en ese momento
    const categoriaSeleccionada = document.getElementById("filtro-categoria").value.toLowerCase();

    // Pasamos todos los productos a los productosFiltrados
    let productosFiltrados = productos;

    // Si categorias no es vacia
    if(categoriaSeleccionada){
        // Primero filtramos por los productos cuya categoria coincida con la seleccionada
        productosFiltrados = productosFiltrados.filter(p => p.categoria.toLowerCase() === categoriaSeleccionada);
    }

    // Si busqueda no es vacio
    if (busqueda) {
        // Filtramos los productos por los productos cuyo nombre coincida por el buscador
        productosFiltrados = productosFiltrados.filter(p => p.nombre.toLowerCase().includes(busqueda));
    }

    mostrarProductos(productosFiltrados);

    // Si no hay productos filtrados y si hay datos
    if (productosFiltrados.length === 0 && (busqueda || categoriaSeleccionada)) {
        //Traemos el contenedor y mostramos un mensaje
        const contenedor = document.getElementById("contenedor-productos");
        contenedor.innerHTML = '<div class="vacio"><i class="bi bi-cup-hot"></i> No se encontraron productos que coincidan con tu búsqueda</div>';
    }
}

// Funcion que muestra los productos filtrados
function mostrarProductos(productos) {
    // Traemos el contendor
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";
    

    // Si no hay nada
    if (productos.length === 0) {
        contenedor.innerHTML = '<div class="vacio"><i class="bi bi-cup-hot"></i> No hay productos registrados</div>';
        return;
    }
    
    // Si hay creamos las tarjetas de cada producto
    productos.forEach(producto => {
        const tarjeta = crearTarjeta(producto);
        contenedor.appendChild(tarjeta);
    });
}

// Y que viva reutilizar codigo sjsjsssjs
function filtrarPorCategoria() {
    buscarProductos();
}

// Ordenar productos
function ordenarProductos(){
    // Obtenemos el tipo de ordenamiento del select
    const ordenSeleccionado = document.getElementById("ordenar").value;

    // Primero aplicamos los filtros actuales
    buscarProductos();

    // Obtenemos los productso ya filtrados como en bucarProductos
    const busqueda = document.getElementById("buscar").value.toLowerCase().trim();
    const categoriaSeleccionada = document.getElementById("filtro-categoria").value.toLowerCase();
    let productosFiltrados = productos;
    
    if (categoriaSeleccionada) {
        productosFiltrados = productosFiltrados.filter(p => p.categoria.toLowerCase() === categoriaSeleccionada);
    }
    if (busqueda) {
        productosFiltrados = productosFiltrados.filter(p => p.nombre.toLowerCase().includes(busqueda));
    }

    // Si hay un valor para orden Seleccionado
    if (ordenSeleccionado) {
        // Aplicar ordenamiento con un Switch
        switch(ordenSeleccionado){
            case 'precio-asc':
                productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
            case 'precio-desc':
                productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
            case 'stock-asc':
                productosFiltrados.sort((a, b) => a.stock - b.stock);
            break;
            case 'stock-desc':
                productosFiltrados.sort((a, b) => b.stock - a.stock);
            break;
            case 'nombre-asc':
                productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
            case 'nombre-desc':
                productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        }
    }

    // Aplicamos esos nuevos filtros y mostramos
    mostrarProductos(productosFiltrados);
}