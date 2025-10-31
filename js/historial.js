// Función para abrir el modal de historial
function abrirHistorialPedidos() {
    const modal = document.getElementById('modal-historial');
    modal.classList.add('activo');
    // Cargar y mostrar los pedidos
    cargarHistorialPedidos();
}

// Función para cerrar el modal de historial
function cerrarHistorialPedidos() {
    const modal = document.getElementById('modal-historial');
    modal.classList.remove('activo');
}

// Función para cargar el historial de pedidos
function cargarHistorialPedidos() {
    // Obtener todos los pedidos del localStorage
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];  //'pedidos' fue guardado en tu archivo carrito.js cuando se confirma un pedido:
    
    // Ordenar por más recientes primero (usando el timestamp del folio)
    pedidos.sort((a, b) => {
        const timestampA = parseInt(a.folio.split('-')[1]);
        const timestampB = parseInt(b.folio.split('-')[1]);
        return timestampB - timestampA;
    });
    
    // Mostrar los pedidos
    mostrarPedidos(pedidos);
}

// Función para mostrar los pedidos en el modal
function mostrarPedidos(pedidos) {
    const listaPedidos = document.getElementById('lista-pedidos');
    
    // Limpiar el contenedor
    listaPedidos.innerHTML = '';
    
    // Si no hay pedidos
    if (pedidos.length === 0) {
        listaPedidos.innerHTML = `
            <div class="no-pedidos">
                <h3>No hay pedidos registrados</h3>
                <p>Cuando se realicen pedidos, aparecerán aquí.</p>
            </div>
        `;
        return;
    }
    
    // Crear una tarjeta por cada pedido
    pedidos.forEach((pedido, index) => {
        const pedidoCard = document.createElement('div');
        pedidoCard.className = 'pedido-card';
        pedidoCard.innerHTML = `
            <div class="pedido-header">
                <div>
                    <div class="pedido-folio">
                        Folio: ${pedido.folio}
                    </div>
                    <div class="pedido-fecha">
                         ${pedido.fecha}
                    </div>
                </div>
            </div>
            
            <div class="pedido-info">
                <div class="info-item">
                    <span class="info-label">Usuario</span>
                    <span class="info-value">
                        <i class="bi bi-person-circle"></i> ${pedido.usuario}
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">Productos</span>
                    <span class="info-value">
                        ${pedido.items.length} ${pedido.items.length === 1 ? 'producto' : 'productos'}
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">Subtotal</span>
                    <span class="info-value">$${pedido.subtotal.toFixed(2)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">IVA (16%)</span>
                    <span class="info-value">$${pedido.iva.toFixed(2)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Total</span>
                    <span class="info-value" style="color: #d19a9a; font-size: 18px;">
                        $${pedido.total.toFixed(2)}
                    </span>
                </div>
            </div>
            
            <div class="pedido-productos">
                <button class="btn-ver-productos" onclick="toggleProductos(${index})">
                    <i class="bi bi-eye"></i>
                    <span id="btn-texto-${index}">Ver productos</span>
                </button>
                <div class="productos-lista" id="productos-${index}">
                    ${generarListaProductos(pedido.items)}
                </div>
            </div>
        `;
        //agregar tarjeta al contenedor
        listaPedidos.appendChild(pedidoCard);
    });
}

// Función para generar la lista de productos de un pedido
function generarListaProductos(items) {
    let html = '';
    
    items.forEach(item => {
        html += `
            <div class="producto-item">
                <div>
                    <div class="producto-nombre">
                        <strong>${item.nombre}</strong>
                    </div>
                    <div class="producto-cantidad">
                        Cantidad: ${item.cantidad} × $${item.precio.toFixed(2)} = $${item.subtotal.toFixed(2)}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 13px; color: #4b2c2c;">+ IVA: $${item.iva.toFixed(2)}</div>
                    <div style="font-weight: 600; color: #7a5555;">Total: $${item.total.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
    
    return html;
}

// Función para mostrar/ocultar los productos de un pedido
function toggleProductos(index) {
    const productosDiv = document.getElementById(`productos-${index}`);
    const btnTexto = document.getElementById(`btn-texto-${index}`);
    
    if (productosDiv.classList.contains('visible')) {
        productosDiv.classList.remove('visible');
        btnTexto.innerHTML = 'Ver productos';
    } else {
        productosDiv.classList.add('visible');
        btnTexto.innerHTML = 'Ocultar productos';
    }
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-historial');
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarHistorialPedidos();
            }
        });
    }
});
