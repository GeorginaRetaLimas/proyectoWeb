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

    // Calculamos el total
    calcularTotal();
}

// Funcion donde mostramos lo que hay en carrito en la tabla
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
            <td>$${item.iva.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-eliminar btn-sm" onclick="eliminarItem(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para cambiar la cantidad de un producto en el carrito
function cambiarCantidad(itemId, cambio) {
    // Encontramos el item en el carrito
    const itemIndex = carritos.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) return;
    
    const item = carritos[itemIndex];
    const nuevaCantidad = item.cantidad + cambio;
    
    // Validamos que la cantidad no sea menor a 1
    if (nuevaCantidad < 1) {
        Swal.fire({
            icon: 'warning',
            title: 'Cantidad mínima',
            text: 'La cantidad mínima es 1.',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }
    
    // Obtenemos los productos del localStorage para verificar stock
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = productos.find(p => p.id === item.id_producto);
    
    if (!producto) {
        Swal.fire({
            icon: 'error',
            title: 'Producto no encontrado',
            text: 'Este producto ya no existe en el almacén'
        });
        return;
    }
    
    // Calculamos cuántos productos de este tipo hay en TODOS los carritos (incluyendo el cambio actual)
    const totalEnCarritos = carritos
        .filter(c => c.id_producto === item.id_producto)
        .reduce((total, c) => {
            // Si es el item actual, usamos la nueva cantidad
            if (c.id === itemId) {
                return total + nuevaCantidad;
            }
            return total + c.cantidad;
        }, 0);
    
    // Calculamos el stock disponible
    const stockDisponible = producto.stock - totalEnCarritos;
    
    // Validamos que no exceda el stock disponible
    if (stockDisponible < 0) {
        const stockActualDisponible = producto.stock - (totalEnCarritos - nuevaCantidad);
        Swal.fire({
            icon: 'error',
            title: 'Stock insuficiente',
            html: `<p>Solo hay <strong>${producto.stock}</strong> unidades en stock de <strong>${producto.nombre}</strong></p>
                   <p class="text-muted mt-2">Stock disponible: ${stockActualDisponible} unidades</p>`,
            confirmButtonText: 'Entendido'
        });
        return;
    }
    
    // Actualizamos la cantidad
    carritos[itemIndex].cantidad = nuevaCantidad;
    
    // Recalculamos subtotal, IVA y total del item
    const precioUnitario = carritos[itemIndex].precio;
    const subtotal = precioUnitario * nuevaCantidad;
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    
    carritos[itemIndex].subtotal = subtotal;
    carritos[itemIndex].iva = iva;
    carritos[itemIndex].total = total;
    
    // Guardamos en localStorage
    localStorage.setItem("carritos", JSON.stringify(carritos));
    
    // Recargamos la vista
    const carritoUsuario = carritos.filter(item => item.id_usuario === usuarioSesion.id_usuario);
    mostrarCarrito(carritoUsuario);
    calcularTotal();
    
    // Mostramos alerta si el stock está bajo (≤ 5 unidades después del cambio)
    if (stockDisponible <= 5 && stockDisponible > 0 && cambio > 0) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        
        Toast.fire({
            icon: 'warning',
            title: `¡Solo quedan ${stockDisponible} unidades disponibles!`
        });
    }
}

// Funcion para eliminar item
function eliminarItem(itemId) {
    // Mostramos una pantalla para pedir confirmación
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
        // Si se quiere eliminar el producto pedir contraseña
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Verificación requerida',
                html: `
                    <p>Ingresa la contraseña para eliminar productos:</p>
                    <input type="password" id="password-eliminar" class="swal1-input" placeholder="Contraseña">
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#d66f8eff',
                cancelButtonColor: '#cda49fff',
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                focusConfirm: false,
                preConfirm: () => {
                    const password = document.getElementById('password-eliminar').value;
                    
                    // Validar que se haya ingresado algo
                    if (!password) {
                        Swal.showValidationMessage('Por favor ingresa la contraseña');
                        return false;
                    }
                    
                    // Verificar la contraseña
                    if (password !== 'cookie123') {
                        Swal.showValidationMessage('Contraseña incorrecta');
                        return false;
                    }
                    
                    return true;
                }
            }).then((passwordResult) => {
                // Si la contraseña es correcta se elimina el producto
                if (passwordResult.isConfirmed) {
                    // Obtener el producto del carrito
                    carritos = carritos.filter(item => item.id !== itemId);

                    // Volver a guardar en localstorage
                    localStorage.setItem("carritos", JSON.stringify(carritos));
                    
                    // Definir el carrito de usuario según los productos que tienen su id
                    const carritoUsuario = carritos.filter(item => item.id_usuario === usuarioSesion.id_usuario);

                    // Volver a dibujar la tabla y calcular el total
                    mostrarCarrito(carritoUsuario);
                    calcularTotal();
                    
                    // Mostrar aviso de eliminado
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'Producto eliminado del carrito',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            });
        }
    });
}

// Funcion para calcular el total de compra
function calcularTotal() {
    // Obtenemos el carrito de usuario
    const carritoUsuario = carritos.filter(item => item.id_usuario === usuarioSesion.id_usuario);

    // Reducimos los elementos al valor de subtotal
    // los acumulamos en suma y con item recorremos, item.subtotal es el precio por la cantidad y le decimos que empieza en 0
    const subtotal = carritoUsuario.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = carritoUsuario.reduce((sum, item) => sum + item.iva, 0);
    const total = subtotal + iva;

    // Actualizamos el resumen
    document.getElementById("resumen-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("resumen-iva").textContent = `$${iva.toFixed(2)}`;
    document.getElementById("resumen-total").textContent = `$${total.toFixed(2)}`;
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

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let errorStock = false;
    let mensajeError = "";

    // Recorremos cada producto
    for (let item of carritoUsuario) {
        const producto = productos.find(p => p.id === item.id_producto);
        
        if (!producto) {
            mensajeError = `El producto ${item.nombre} ya no existe`;
            errorStock = true;
            break;
        }

        // checamos los stocks segun todos los carritos
        const cantidadEnCarritos = carritos
            .filter(c => c.id_producto === item.id_producto)
            .reduce((total, c) => total + c.cantidad, 0);

        if (cantidadEnCarritos > producto.stock) {
            mensajeError = `No hay suficiente stock de ${item.nombre}. Disponible: ${producto.stock}`;
            errorStock = true;
            break;
        }
    }

    if (errorStock) {
        Swal.fire({
            icon: "error",
            title: "Error en el pedido",
            text: mensajeError
        });
        return;
    }

    // Generar folio único con la fecha
    const folio = 'Cookies-' + Date.now();

    // Obtenemos la fecha
    const fecha = new Date().toLocaleString();

    // Calculamos correctamente el total -> subtotal + IVA
    const subtotalPedido = carritoUsuario.reduce((sum, item) => sum + item.subtotal, 0);
    const ivaPedido = carritoUsuario.reduce((sum, item) => sum + item.iva, 0);
    const totalPedido = subtotalPedido + ivaPedido;

    // Creamos pedido
    const pedido = {
        folio: folio,
        fecha: fecha,
        id_usuario: usuarioSesion.id_usuario,
        usuario: usuarioSesion.username,
        items: [...carritoUsuario], // copiamos los productos del carrito
        subtotal: subtotalPedido,
        iva: ivaPedido,
        total: totalPedido
    };

    console.log(pedido);

    // Descontamos el stock de los productos
    carritoUsuario.forEach(item => {
        const producto = productos.find(p => p.id === item.id_producto);
        if (producto) {
            producto.stock -= item.cantidad;
            
            // No permitir stock negativo
            if (producto.stock < 0) producto.stock = 0;
        }
    });

    // Guardamos los productos actualizados en localStorage
    localStorage.setItem("productos", JSON.stringify(productos));

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
                <p><strong>Subtotal:</strong> $${subtotalPedido.toFixed(2)}</p>
                <p><strong>IVA:</strong> $${ivaPedido.toFixed(2)}</p>
                <p><strong>Total:</strong> $${totalPedido.toFixed(2)}</p>
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
