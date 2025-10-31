console.log("conexion exitosa");

// Colores de las gráficas
const colores = {
    productos: [
        'rgba(209, 154, 154, 0.8)',
        'rgba(228, 179, 176, 0.8)',
        'rgba(217, 165, 161, 0.8)',
        'rgba(198, 138, 138, 0.8)',
        'rgba(181, 115, 115, 0.8)',
        'rgba(166, 99, 99, 0.8)',
        'rgba(151, 85, 85, 0.8)',
        'rgba(136, 71, 71, 0.8)'
    ],
    categorias: [
        'rgba(209, 154, 154, 0.8)',
        'rgba(220, 212, 180, 0.8)',
        'rgba(197, 220, 180, 0.8)',
        'rgba(180, 207, 220, 0.8)',
        'rgba(210, 180, 220, 0.8)'
    ],
    ventas: 'rgba(209, 154, 154, 1)'
};

// Cada que se recarga la pagina graficamos
document.addEventListener('DOMContentLoaded', function() {
    graficarProductosVendidos();
    graficarVentasPorDia();
    graficarVentasPorCategoria();
});

// Gráfica de productos más vendidos
function graficarProductosVendidos(){

    // Obtenemos un array con los productos vendidos
    const datos = obtenerProductosVendidos();
    
    // Si no hay datos o el array es cero
    if (!datos || datos.length === 0) {
        mostrarMensajeVacio('graficaProductos', 'No hay datos de ventas disponibles');
        return;
    }

    // Nos traemos en canva del html osea contexto
    const ctx = document.getElementById('graficaProductos').getContext('2d');
    
    // Ordenar el top de mayor a menos y solo dejamos 8 visibles
    const topProductos = datos.sort((a, b) => b.ventas - a.ventas).slice(0, 8);

    // Dibujamos la grafica de barras de productos mas vendidos en el contexto traido
    new Chart(ctx, {
        type: 'bar', // Aqui definimos que es de barras
        data: {
            // Aqui definimos los nombres de cada elemento con el map y la función de acortar texto
            labels: topProductos.map(item => acortarTexto(item.nombre_producto, 15)),

            // Establecemos los datos especificos a graficar
            datasets: [{
                // El titulo de los datos que se estan graficando
                label: 'Unidades Vendidas',
                
                // Las unidades en veta que se van a graficar
                data: topProductos.map(item => item.ventas),

                // Aqui definimos el color de fondo
                backgroundColor: colores.productos,

                // El color del borde de las barras
                borderColor: colores.productos.map(color => color.replace('0.8', '1')),

                // Tamaño borde y estilos
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            // Adaptable a otros dispositivos
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(90, 45, 45, 0.9)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    // Definimos una función personalizada 
                    callbacks: {
                        // Esta es la función que se encraga de generar el titulo cuando pasa el mouse sobre un elemento de la gráfica
                        title: function(tooltipItems) {
                            // Obtenemos el index de donde este el mouse
                            const index = tooltipItems[0].dataIndex;
                            return topProductos[index].nombre_producto;
                        }
                    }
                }
            },
            // Estos son los datos escala de grafica
            scales: {
                y: {
                    beginAtZero: true,
                    // Rayitas que cortan la grafica horizontalmente
                    grid: {
                        color: 'rgba(90, 45, 45, 0.1)'
                    },
                    // Son los numeros del lado de las Y
                    ticks: {
                        color: '#040000ff',
                        // Aquí se especifica cuanto van a avanzar
                        stepSize: 1
                    },
                    // Titulo que esta del lado de las Y
                    title: {
                        // Que se muestre
                        display: true,
                        text: 'Unidades Vendidas',
                        color: '#5a2d2d'
                    }
                },
                x: {
                    // No se muestran las lineas de corte verticales
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Gráfica de líneas de ventas por día
function graficarVentasPorDia(){
    // Obtenemos el array que contiene las ventas por dia
    const datos = obtenerVentasPorDia();
    
    // Si no hay registros maandamos este mensaje de vacio
    if (!datos || datos.length === 0) {
        mostrarMensajeVacio('graficaVentas', 'No hay ventas registradas por día');
        return;
    }

    // Obtenemos el contenido de la grafica de Ventas
    const ctx = document.getElementById('graficaVentas').getContext('2d');

    // Volvemos a dibujar la grafica
    new Chart(ctx, {
        type: 'line', // Establecemos que es de líneas
        data: {
            // Sacamos las fechas de cada punto de la grafica
            labels: datos.map(item => item.fecha),
            
            // Establecemos los valores a graficar 
            datasets: [{
                // Ponemos el "titulo" de la grafica
                label: 'Ingresos por Día ($)',

                // Establecemos que lo que se graficara seran los ingresos
                data: datos.map(item => item.ingresos),

                // Obtenemos los colores de ventas del vector global
                borderColor: colores.ventas,

                // Color de lo coloreado bajo la linea
                backgroundColor: 'rgba(255, 0, 0, 0.1)',

                // Grosor de la rayita
                borderWidth: 3,
                
                // Que tan circular sera la rayita nada jsjsjsjs
                tension: 0,

                // llenado verdadero
                fill: true,
                
                // Estilos del punto
                pointBackgroundColor: 'rgba(90, 45, 45, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#5a2d2d',
                        font: {
                            size: 12
                        }
                    }
                },

                // Contexto cuando se le pase el mouse por encima a un punto de la grafica
                tooltip: {
                    backgroundColor: 'rgba(90, 45, 45, 0.9)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    callbacks: {
                        label: function(context) {
                            return `Ingresos: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    // Lineas horizontales
                    grid: {
                        color: 'rgba(90, 45, 45, 0.1)'
                    },

                    // Valores de la escala
                    ticks: {
                        color: '#5a2d2d',
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    },
                    
                    // Titulo del lado de las Y
                    title: {
                        display: true,
                        text: 'Ingresos ($)',
                        color: '#5a2d2d'
                    }
                },
                x: {
                    // No rayitas verticales
                    grid: {
                        display: false
                    },
                    
                    ticks: {
                        color: '#5a2d2d'
                    },

                    // Título del lado de las Y
                    title: {
                        display: true,
                        text: 'Fecha',
                        color: '#5a2d2d'
                    }
                }
            }
        }
    });
}

// Gráfica de ventas por categoría
function graficarVentasPorCategoria(){
    // Nos traemos el vector con los datos de venta por categoria
    const datos = obtenerVentasPorCategoria();
    
    // Mostramos mensaje si el vector esta vacío
    if (!datos || datos.length === 0) {
        mostrarMensajeVacio('graficaCategotias', 'No hay ventas por categoría');
        return;
    }

    // Nos traemos el contexto del canva
    const ctx = document.getElementById('graficaCategotias').getContext('2d');

    // Dibujamos la grafica en ese contexto
    new Chart(ctx, {
        type: 'doughnut', // Grafica en forma de donita
        data: {
            // Los nombres de las categorias que se grafican
            labels: datos.map(item => item.categoria),

            // Datos que se van a graficar
            datasets: [{
                // Establecemos el ingreso para ser graficado
                data: datos.map(item => item.ingresos),
                
                // Establecemos estilos
                backgroundColor: colores.categorias,
                borderColor: colores.categorias.map(color => color.replace('0.8', '1')),
                borderWidth: 2,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#5a2d2d',
                        font: {
                            size: 11
                        },
                        padding: 15
                    }
                },

                // Lo que se muestra cuando pasa el mouse por encima
                tooltip: {
                    backgroundColor: 'rgba(90, 45, 45, 0.9)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    callbacks: {

                        // Mostramos la categoria, dinero y el porcentaje
                        label: function(ctx) {
                            const valor = ctx.parsed;
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const porcentaje = ((valor / total) * 100).toFixed(1);
                            return `${ctx.label}: $${valor.toFixed(2)} (${porcentaje}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Funciones de obtención de datos
function obtenerProductosVendidos(){
    // Nos traemos todos los datos de pedidos de localStorage
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    
    // En caso de que no haya nada mostrar en consola
    if(pedidos.length === 0){
        console.log("No hay pedidos en el localStorage");
        return [];
    }

    // Definimos el valor a retornar
    let productosVendidos = [];

    // Recorremos to
    pedidos.forEach(pedido => {
        if (pedido.items && Array.isArray(pedido.items)) {
            pedido.items.forEach(item => {
                const itemExistente = productosVendidos.find(p => p.id_producto === item.id_producto);

                if(itemExistente){
                    itemExistente.ventas += item.cantidad;
                    itemExistente.total += item.total;
                } else {
                    const productoVenta = {
                        id_producto: item.id_producto,
                        nombre_producto: item.nombre,
                        ventas: item.cantidad,
                        total: item.total
                    };
                    productosVendidos.push(productoVenta);
                }
            });
        }
    });

    console.log("Productos vendidos procesados:", productosVendidos);
    return productosVendidos;
}

function obtenerVentasPorDia(){
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    
    if(pedidos.length === 0){
        return [];
    }

    const ventasPorDia = {};
    
    const meses = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    
    pedidos.forEach(pedido => {
        try {
            let fechaFormateada = 'Sin fecha';
            
            if (pedido.fecha && typeof pedido.fecha === 'string') {
                let fechaObj;
                
                // Verificamos si tiene el formato de date
                if (pedido.fecha.includes('/')) {
                    const partes = pedido.fecha.split(',')[0].split('/');
                    if (partes.length >= 3) {
                        const dia = parseInt(partes[0]);
                        const mes = parseInt(partes[1]) - 1; // Los meses son del 0 al 11
                        const año = parseInt(partes[2]) || new Date().getFullYear();
                        fechaObj = new Date(año, mes, dia);
                    } else if (partes.length === 2) {
                        const dia = parseInt(partes[0]);
                        const mes = parseInt(partes[1]) - 1;
                        fechaObj = new Date(new Date().getFullYear(), mes, dia);
                    }
                }
                
                // Si no funciona entonces con Date
                if (!fechaObj || isNaN(fechaObj.getTime())) {
                    fechaObj = new Date(pedido.fecha);
                }
                
                // Si no con isNan
                if (!fechaObj || isNaN(fechaObj.getTime())) {
                    fechaObj = new Date();
                }
                
                // Formatear
                const dia = fechaObj.getDate();
                const mes = meses[fechaObj.getMonth()];
                const año = fechaObj.getFullYear();
                
                fechaFormateada = `${dia} ${mes} ${año}`;
                
            } else {
                // Si no hay fecha usar la actual
                const ahora = new Date();
                const dia = ahora.getDate();
                const mes = meses[ahora.getMonth()];
                const año = ahora.getFullYear();
                fechaFormateada = `${dia} ${mes} ${año}`;
            }
            
            if (!ventasPorDia[fechaFormateada]) {
                ventasPorDia[fechaFormateada] = 0;
            }
            ventasPorDia[fechaFormateada] += pedido.total || 0;
            
        } catch (error) {
            console.error('Error procesando fecha del pedido:', error);
            // En caso de error usar la fecha actual
            const ahora = new Date();
            const dia = ahora.getDate();
            const mes = meses[ahora.getMonth()];
            const año = ahora.getFullYear();
            const fechaFormateada = `${dia} ${mes} ${año}`;
            
            if (!ventasPorDia[fechaFormateada]) {
                ventasPorDia[fechaFormateada] = 0;
            }
            ventasPorDia[fechaFormateada] += pedido.total || 0;
        }
    });

    console.log("Ventas por día procesadas:", ventasPorDia);

    // Convertir a array
    const resultado = Object.keys(ventasPorDia).map(fecha => ({
        fecha: fecha,
        ingresos: ventasPorDia[fecha]
    }));

    // Ordenar por fecha más reciente
    resultado.sort((a, b) => {
        try {
            // Convertir rl formato creado a fecha
            const partesA = a.fecha.split(' ');
            const partesB = b.fecha.split(' ');
            
            if (partesA.length === 3 && partesB.length === 3) {
                const diaA = parseInt(partesA[0]);
                const mesA = meses.indexOf(partesA[1]);
                const añoA = parseInt(partesA[2]);
                
                const diaB = parseInt(partesB[0]);
                const mesB = meses.indexOf(partesB[1]);
                const añoB = parseInt(partesB[2]);
                
                const fechaA = new Date(añoA, mesA, diaA);
                const fechaB = new Date(añoB, mesB, diaB);
            
                // Ordenamos ascendentemente
                return fechaA - fechaB; 
            }
        } catch (error) {
            console.error('Error ordenando fechas:', error);
        }
        return 0;
    });

    return resultado;
}

function obtenerVentasPorCategoria(){
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    
    if(pedidos.length === 0){
        return [];
    }

    const ventasPorCategoria = {};
    
    pedidos.forEach(pedido => {
        if (pedido.items && Array.isArray(pedido.items)) {
            pedido.items.forEach(item => {
                const producto = productos.find(p => p.id === item.id_producto);
                const categoria = producto ? producto.categoria : 'Sin categoría';
                
                if (!ventasPorCategoria[categoria]) {
                    ventasPorCategoria[categoria] = 0;
                }
                ventasPorCategoria[categoria] += item.total;
            });
        }
    });

    // Convertir a array
    return Object.keys(ventasPorCategoria).map(categoria => ({
        categoria: categoria,
        ingresos: ventasPorCategoria[categoria]
    }));
}

// Cuando el texto sea mayor a la longitud ingresada se le pondran puntos ...
function acortarTexto(texto, longitud) {
    return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
}

// Funcion que se retorna cuando no hay datos que graficar
function mostrarMensajeVacio(canvasId, mensaje) {
    // Traemos el canvas
    const canvas = document.getElementById(canvasId);

    // Si no encuentra la id del canva que avise
    if (!canvas) {
        console.error(`Canvas con id ${canvasId} no encontrado`);
        return;
    }
    
    // Traemos el contexto, lo que este dibujado
    const ctx = canvas.getContext('2d');
    
    // Limpiamos este contexto
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mostramos el mensaje de vacio
    ctx.fillStyle = '#7a5555';
    ctx.font = '16px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Mandamos el mensaje
    ctx.fillText(mensaje, canvas.width / 2, canvas.height / 2);
}

// Eliminar los datos del localStorage
function BorrarDatos(){
    Swal.fire({
        title: '¿Eliminar los datos?',
        text: "¿Estás seguro de que quieres eliminar todos los datos de la pagina?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d66f8eff',
        cancelButtonColor: '#cda49fff',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        // Si se quiere eliminar
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.reload();
        }
    });
}