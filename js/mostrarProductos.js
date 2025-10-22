// Variable global para almacenar el ID del producto que se va a eliminar
let productoAEliminar = null;

let productos = [];
let carritos = [];

// Ejecuta cargar Productos cuando el DOM está completamente cargado
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

        const nuevosProducto = [
            {
                id: 1,
                nombre: "Revanado de Pastel de chocolate",
                categoria: "Pastel",
                imagen: "https://content-cocina.lecturas.com/medio/2023/03/23/el-mejor-pastel-de-chocolate_24bd9cda_1200x1200.jpg",
                precio: 35.99,
                stock: 7
            }, 
            {
                id: 2,
                nombre: "Galletas de jengibre navideña",
                categoria: "Galleta",
                imagen: "https://cdn.pixabay.com/photo/2015/11/19/20/17/cookies-1051884_1280.jpg",
                precio: 40.99,
                stock: 8
            },
            {
                id: 3,
                nombre: "Galleta del amigo de Shrek",
                categoria: "Galleta",
                imagen: "https://tse1.mm.bing.net/th/id/OIP.vAMm8_HNRuuzwv8N-lRVQgHaHa?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
                precio: 99,
                stock: 5
            },
            {
                id: 4,
                nombre: "Cupcake con chispas",
                categoria: "Cupcake",
                imagen: "https://tse3.mm.bing.net/th/id/OIP._45jwvGc1O2WnvrHz9VPvAHaE8?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
                precio: 20.00,
                stock: 30
            },
            {
                id: 5,
                nombre: "Pastel de extra chocolate",
                categoria: "Pastel",
                imagen: "https://thvnext.bing.com/th/id/OIP.4XgedmZ1jXoAKMyBUhyfogHaHa?o=7&cb=12rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
                precio: 99.99,
                stock: 21
            }, 
            {
                id: 6,
                nombre: "Gato Galleta",
                categoria: "Galleta",
                imagen: "https://th.bing.com/th/id/R.ddb28aed89bd3dc780de2a5e68e231c8?rik=hHp67jVm9pdn%2bA&pid=ImgRaw&r=0",
                precio: 45.00,
                stock: 6
            },
            {
                id: 7,
                nombre: "Cupcake de chocolate barato",
                categoria: "Cupcake",
                imagen: "https://thvnext.bing.com/th/id/OIP.vadSd3OmhvvL1QjeXmq9QwHaLH?o=7&cb=12rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
                precio: 10.00,
                stock: 55
            },
            {
                id: 8,
                nombre: "Cupckake de chocolate con vainilla, chispas y fresa",
                categoria: "Cupcake",
                imagen: "https://thvnext.bing.com/th/id/OIP.moTgjQ6g-vajYnZisxvDhQHaLH?o=7&cb=12rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
                precio: 25.00,
                stock: 35
            }
        ];
        
        // Agregar a la lista
        productos = nuevosProducto;
        
        // Guardar en localStorage
        localStorage.setItem("productos", JSON.stringify(productos));


        contenedor.innerHTML = '<div class="vacio">No hay productos registrados</div>';

        return;
    }
    
    // Recorre cada producto y crea una tarjeta para cada uno
    productos.forEach(producto => {
        const tarjeta = crearTarjeta(producto);
        if (tarjeta.children.length > 0) {
            contenedor.appendChild(tarjeta);
        }
    });
}

// Crea un elemento HTML con la estructura de la tarjeta del producto
function crearTarjeta(producto) {
    // Calcular stock disponible
    const cantidadEnCarritos = carritos
        .filter(item => item.id_producto === producto.id)
        .reduce((total, item) => total + item.cantidad, 0);
    
    const stockDisponible = producto.stock - cantidadEnCarritos;

    // No mostramos si no hay stock
    if (stockDisponible <= 0) {
        return document.createElement("div"); // Retornamos un div vacío
    }

    // Crea un div que será la tarjeta
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    let claseStock = "stock flex-grow-1";
    let mensajeStock = `Stock: ${stockDisponible} unidades`;

    if (stockDisponible <= 5) {
        claseStock += " stock-bajo";
        mensajeStock = `<i class="bi bi-exclamation-triangle"></i> Stock: ${stockDisponible} unidades`;
    }
    
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
                    Stock: ${stockDisponible} unidades
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
    carritos = JSON.parse(localStorage.getItem("carritos")) || [];
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
        if (tarjeta.children.length > 0) {
            contenedor.appendChild(tarjeta);
        }
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

    // Verificar si el producto tiene stock
    if (producto.stock <= 0) {
        Swal.fire({
            icon: "error",
            title: "Sin stock",
            text: "Este producto no tiene unidades disponibles"
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

    // Verificar si hay stock disponible
    if (stockDisponible <= 0) {
        Swal.fire({
            icon: "error",
            title: "Stock insuficiente",
            text: "No hay stock disponible. Todos los productos están apartados en otros carritos."
        });
        return;
    }

    // Verificamos si el producto ya esta en el carrito del usuario
    const itemExistente = carritos.find(item => item.id_producto === id && item.id_usuario === usuarioSesion.id_usuario);

    if (itemExistente) {
        // Actualizamos cantidad y cálculos
        itemExistente.cantidad += 1;
        itemExistente.subtotal = itemExistente.cantidad * producto.precio;
        itemExistente.iva = itemExistente.subtotal * 0.16;
        itemExistente.total = itemExistente.subtotal + itemExistente.iva;
    } else {
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
    }

    // Guardamos en local storage
    localStorage.setItem("carritos", JSON.stringify(carritos));

    const nuevoStockDisponible = stockDisponible - 1;
    
    if (nuevoStockDisponible <= 5 && nuevoStockDisponible > 0) {
        Swal.fire({
            icon: "warning",
            title: "Producto agregado",
            html: `<p><strong>${producto.nombre}</strong> agregado al carrito</p>
                   <p class="text-warning mt-2"><i class="bi bi-exclamation-triangle"></i> ¡Atención! Quedan solo <strong>${nuevoStockDisponible}</strong> unidades disponibles</p>`,
            confirmButtonText: "Entendido"
        });
    } else {
        Swal.fire({
            icon: "success",
            title: "Producto agregado",
            text: `${producto.nombre} agregado al carrito`,
            timer: 1500,
            showConfirmButton: false
        });
    }

}