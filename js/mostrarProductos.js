// Variable global para almacenar el ID del producto que se va a eliminar
let productoAEliminar = null;

let productos = [];
let carritos = [];

// Ejecuta cargarProductos cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
});

// Obtiene los productos del localStorage, limpia el contenedor y genera las tarjetas
function cargarProductos() {
    // Obtiene el array de productos desde localStorage, si no existe retorna un array vacío
    productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Obtenemos el array de carrito si no es vacio
    carritos = JSON.parse(localStorage.getItem("carritos")) || [];

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
            <div class="row align-items-center">
            
            <div class="d-flex gap-3 align-items-center">
                <div class="stock flex-grow-1">
                    Stock: ${producto.stock} unidades
                </div>
                <button class="btn-carrito" onclick="añadirCarrito(${producto.id})">
                    <i class="bi bi-cart"></i>
                </button>
            </div>

            <div class="botones">
                <button class="btn-editar" onclick="abrirEdicion(${producto.id})">Editar</button>
                <button class="btn-eliminar" onclick="abrirModalEliminacion(${producto.id})">Eliminar</button>
            </div>
            <br>
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

// Función para buscar, filtrar y ordenar
function aplicarFiltros() {
    // Obtenemos todos los valores de los filtros de contenido
    const busqueda = document.getElementById("buscar").value.toLowerCase().trim();
    const categoriaSeleccionada = document.getElementById("filtro-categoria").value.toLowerCase();
    const ordenSeleccionado = document.getElementById("ordenar").value;

    // Partimos de todos los productos
    let productosFiltrados = [...productos]; // Copiamos el array por si acaso

    // Primero filtramos por categoria
    if (categoriaSeleccionada) {
        productosFiltrados = productosFiltrados.filter(p => p.categoria.toLowerCase() === categoriaSeleccionada
        );
    }

    // Buscamos a traves del nombre
    if (busqueda) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(busqueda)
        );
    }

    // Y ordenamos segun la seleccion
    if (ordenSeleccionado) {
        switch(ordenSeleccionado) {
            case 'precio-asc':
                // Si la resta da resultado de la resta da negatico entonces a va primero dejando a A como la mayor
                productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
            case 'precio-desc':
                // Si la resta da resultado de la resta da positivo entonces a va primero dejando a A como la menor
                productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
            case 'stock-asc':
                productosFiltrados.sort((a, b) => a.stock - b.stock);
            break;
            case 'stock-desc':
                productosFiltrados.sort((a, b) => b.stock - a.stock);
            break;
            case 'nombre-asc':
                // localCompare compara strings con la misma logica de arriba pero para letras
                productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
            case 'nombre-desc':
                productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
        }
    }

    // Mostramos los resultados
    mostrarProductos(productosFiltrados);

    // Pero si no hay resultados y si hay busqueda o categorias seleccionadas
    if (productosFiltrados.length === 0 && (busqueda || categoriaSeleccionada)) {
        // Tomamos el contenedor y mostramos un mensaje
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

function añadirCarrito(id){
    console.log("Entrando a funcion añadir a carrito");

    // Verificamos si hay un usuario en la sesion
    const usuarioSesion = JSON.parse(localStorage.getItem('sesion'));

    if (!usuarioSesion) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debes iniciar sesión para agregar productos al carrito"
        });
        return;
    }

    // Obtener el producto
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Producto no encontrado, como hiciste eso?"
        });
        return;
    }

    let carritos = JSON.parse(localStorage.getItem("carritos")) || [];

    // Calcular el stock según la cantidad en loscarritos
    const cantidadEnCarritos = carritos
        .filter(item => item.id_producto === id)
        .reduce((total, item) => total + item.cantidad, 0);

    const stockDisponible = producto.stock - cantidadEnCarritos;

    console.log('Stock total:',  producto.stock);
    console.log('En carritos: ', cantidadEnCarritos);
    console.log('Disponible: ', stockDisponible);

    // Verificamos si el producto ya esta en el carrito del usuario
    const itemExistente = carritos.find(item => item.id_producto === id && item.id_usuario === usuarioSesion.id_usuario);

    if (itemExistente) {
        // Verificamos el stock disponible
        if (stockDisponible <= 0) {
            Swal.fire({
                icon: "error",
                title: "Stock insuficiente",
                text: "No hay suficiente stock disponible, todos los productos estan apartados"
            });
            return;
        }

        itemExistente.cantidad += 1;
        itemExistente.subtotal = itemExistente.cantidad * producto.precio;
        itemExistente.iva = itemExistente.subtotal * 0.16;
        itemExistente.total = itemExistente.subtotal + itemExistente.iva;

        // Avisamos si hay poquitos productos
        console.log("Stock Disponible: ", stockDisponible);
        if (stockDisponible <= 5) {
            console.log("Entrando a función de stock");
            Swal.fire({
                icon: "warning",
                title: "Stock bajo",
                text: `Quedan menos de 5 unidades de ${producto.nombre}, contacte al proveedor`,
                timer: 3000
            });
        }
    } else {
        // Verificamos si hay stock
        if (stockDisponible < 1) {
            Swal.fire({
                icon: "error",
                title: "Sin stock",
                text: "Este producto no tiene stock disponible"
            });
            return;
        }

        console.log("IVA: ", producto.precio * 0.16);

        const subtotal = producto.precio;
        const iva = producto.precio * 0.16;
        const total = subtotal + iva;

        // Creamos un nuevo item en carrito
        const nuevoItem = {
            id: Date.now(),
            id_producto: producto.id,
            id_usuario: usuarioSesion.id_usuario,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            subtotal: subtotal,
            iva: iva,
            total: total,
            imagen: producto.imagen
        };

        carritos.push(nuevoItem);

        // Verificamos si el stock bajo
        if (stockDisponible <= 5) {
            Swal.fire({
                icon: "warning",
                title: "Stock bajo",
                text: `Quedan menos de ${stockDisponible} unidades de ${producto.nombre}, contacte al proveedor`,
                timer: 3000,
                showConfirmButton: true
            });
        }
    }

    // Guardamos en local storage
    localStorage.setItem("carritos", JSON.stringify(carritos));

    Swal.fire({
        icon: "success",
        title: "Producto agregado :D",
        text: `${producto.nombre} agregado al carrito, compre, compre, compre más`,
        timer: 1500,
        showConfirmButton: false
    });

}