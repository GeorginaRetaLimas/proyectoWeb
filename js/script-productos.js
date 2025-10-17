// Variables necesarias para el modo de edición
let modoEdicion = false;
let productoIdEdicion = null;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");

    // Verificamos si es que estamos en modo edición
    verificarModoEdicion();
    
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        // Si esta en modo edicion actualizamos
        if (modoEdicion) {
            actualizarProducto();
        } else {
            guardarProducto();
        }
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

    // Validamos que la imagen sea valida
    if (!imagen.value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        Swal.fire({
            icon: "error",
            title: "Imagen no valida",
            text: "Por favor ingrese el URL de una imagen valida"
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

/* Parte de Gina wiwiwiwiw --*/

function verificarModoEdicion() {
    // Obtenemos el producto que esta en edicion
    const productoEnEdicion = JSON.parse(localStorage.getItem("productoEnEdicion"));

    // Si hay datos en edicion
    if (productoEnEdicion) {
        modoEdicion = true;
        productoIdEdicion = productoEnEdicion.id; 
        cargarDatosFormulario(productoEnEdicion);
    } else { // Si no limpiamos
        modoEdicion = false;
        productoIdEdicion = null;
        localStorage.removeItem("productoEnEdicion");
    }
}

// Cargamos los datos del producto en edicion en los input
function cargarDatosFormulario(producto) {
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("categoria").value = producto.categoria;
    document.getElementById("imagen").value = producto.imagen;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("producto-id").value = producto.id;
    
    // Y ahora el input oculto tendra el id y nombre de Editar Producto
    document.getElementById("titulo-formulario").textContent = "Editar Producto";
    document.getElementById("btn-submit").textContent = "Actualizar Producto";
}

// Cuando se cierre el formulario lo que va a hacer es llevarnos a mostrar Productos 
function cerrarFormulario() {
    localStorage.removeItem("productoEnEdicion");
    
    // Regresar a la página de productos
    window.location.href = "mostrarProductos.html";
}

// Actualizacion del producto
function actualizarProducto() {
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

    // Validamos que la imagen sea valida
    if (!imagen.value.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        Swal.fire({
            icon: "error",
            title: "Imagen no valida",
            text: "Por favor ingrese el URL de una imagen valida"
        });
        return;
    }

    // Nos traemos todo el array de productos
    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Para traer el indice a editar
    const indice = productos.findIndex(p => p.id === productoIdEdicion);

    const productoId = productoIdEdicion;
    if (indice !== -1) {
        productos[indice] = {
            id: productoId, // Mantener el mismo ID
            nombre: nombre.value.trim(),
            categoria: categoria.value,
            imagen: imagen.value.trim(),
            precio: parseFloat(precio.value),
            stock: parseInt(stock.value)
        };

        localStorage.setItem("productos", JSON.stringify(productos));

        // Limpiar el producto en edición
        localStorage.removeItem("productoEnEdicion");

        Swal.fire({
            icon: "success",
            title: "¡Producto editado!",
            text: "El producto se ha editado correctamente."
        }).then(() => {
            // Redirigir al mostrar Productos
            window.location.href = "mostrarProductos.html";
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo encontrar el producto para actualizar."
        });
    }
}
