let carritos = [];
let usuarioSesion = null;

document.addEventListener("DOMContentLoaded", () => {
    cargarCarrito();
});

function cargarCarrito() {
    // Verificamos la sesión
    usuarioSesion = JSON.parse(localStorage.getItem('sesion'));
    
    // Obtenemos los carritos del localStorage
    carritos = JSON.parse(localStorage.getItem("carritos")) || [];

    // Filtramos al contenido del usuario
    const carritoUsuario = carritos.filter(item => item.id_usuario === usuarioSesion.id_usuario);

    // Mostramos el carrito del usuario
    mostrarCarrito(carritoUsuario);

    // Calculamos el totañ
    calcularTotal();

}

// Funcion donde mostramos lo que hay en carrtio en la tabla
function mostrarCarrito(items) {
    const tbody = document.getElementById("tabla-carrito-body");
    const vacio = document.getElementById("carrito-vacio");
    const lleno = document.getElementById("carrito-lleno");

    // Si no hay items añadimos un invisible
    if (items.length === 0) {
        vacio.classList.remove("d-none");
        lleno.classList.add("d-none");
        return;
    }

    // Se lo quitamos si hay items
    vacio.classList.add("d-none");
    lleno.classList.remove("d-none");

    // Limpiamos el body
    tbody.innerHTML = "";

    // Volvemos a dibujarlo
    items.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <img src="${item.imagen}" alt="${item.nombre}" class="img-carrito" onerror="this.src='https://via.placeholder.com/50x50?text=Imagen'">
                ${item.nombre}
            </td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>$${item.subtotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-eliminar btn-sm" onclick="eliminarItem(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funcion para sumar o restar uno, pero no es mi parte sjsjssj * baila enloquecida * perdon
function cambiarCantidad(itemId, cambio) {
    
}

// Funcion para eliminar item
function eliminarItem(itemId) {
    // Mostramos una pantalla para pedir confimación
    Swal.fire({
        title: '¿Eliminar producto carrito?',
        text: "¿Estás seguro de que quieres eliminar este producto del carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d66f8eff',
        cancelButtonColor: '#cda49fff',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        // Si se confima
        if (result.isConfirmed) {
            // Obtenemos el producto del carrito
            carritos = carritos.filter(item => item.id !== itemId);

            // Volvemos a guardar en localstorage
            localStorage.setItem("carritos", JSON.stringify(carritos));
            
            // Definimos el carrito de usario según los productos que tienen su id
            const carritoUsuario = carritos.filter(item => item.id_usuario === usuarioSesion.id_usuario);

            // Volvemos a dibujar la tabla y calcular
            mostrarCarrito(carritoUsuario);
            calcularTotal();
            
            // mostramos el aviso de eliminado
            Swal.fire('Eliminado', 'Producto eliminado del carrito', 'success');
        }
    });
}

// Funcion para calcular el total de compra
function calcularTotal() {
    // Obtenemos el carrito de usuario
    const carritoUsuario = carritos.filter(item => item.id_usuario === usuarioSesion.id_usuario);

    // Reducimos los elementos al valor de subtotal
    // los acumulamos en suma y con item recorremos, item.subtotal es el precio por la cantidad y le decimos que empieza en 0
    const total = carritoUsuario.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Mostramos en total carrito solamente dejando dos valores despues del puntito
    document.getElementById("total-carrito").textContent = `$${total.toFixed(2)}`;
}

// Si el pedido se confirma
function confirmarPedido() {
    // Obtenemos el carrito del usuario
    const carritoUsuario = carritos.filter(item => item.id_usuario === usuarioSesion.id_usuario);
    
    // Checamos si el carrito esta vacio
    if (carritoUsuario.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Carrito vacío",
            text: "Agrega productos al carrito antes de confirmar el pedido"
        });
        return;
    }

    // Generar folio único con la fecga
    const folio = 'Coockies-' + Date.now();

    // Obtenemos la fecha
    const fecha = new Date().toLocaleString();

    // Creamos pedido
    const pedido = {
        folio: folio,
        fecha: fecha,
        id_usuario: usuarioSesion.id_usuario,
        usuario: usuarioSesion.username,
        items: [...carritoUsuario], // copiamos los productos del carrito
        total: carritoUsuario.reduce((sum, item) => sum + item.subtotal, 0)
        //estado: 'entregado'
    };

    // Guardamos el pedido en localStorage
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    // Limpiamos el carrito del usuario
    carritos = carritos.filter(item => item.id_usuario !== usuarioSesion.id_usuario);
    localStorage.setItem("carritos", JSON.stringify(carritos));

    // Mostramos el resumen de la compra
    Swal.fire({
        title: '¡Pedido Confirmado!',
        html: `
            <div class="text-start">
                <p><strong>Folio:</strong> ${folio}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
                <p><strong>Productos:</strong> ${pedido.items.length}</p>
            </div>
        `,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        // Si el pedido se confirma, vaciamos el carrito
        cargarCarrito();
    });
}

// Limpiamos el carrito
function vaciarCarrito() {
    Swal.fire({
        title: '¿Vaciar carrito?',
        text: "¿Estás seguro de que quieres vaciar todo el carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgba(181, 23, 81, 1)',
        cancelButtonColor: '#e78cb6ff',
        confirmButtonText: 'Vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        // Si se confirma
        if (result.isConfirmed) {
            // Quitamos del carrito lo que es del usuario
            carritos = carritos.filter(item => item.id_usuario !== usuarioSesion.id_usuario);

            // Actualizamos en localStorage
            localStorage.setItem("carritos", JSON.stringify(carritos));
            
            // Cargamos el carrito
            cargarCarrito();

            // Mostramos el aviso de exito
            Swal.fire('Carrito vaciado', 'Todos los productos han sido eliminados', 'success');
        }
    });
}

//Bitacora de gina: los stock me estan ganando, aunque les puse muchas cosas no salen bien pipipipi