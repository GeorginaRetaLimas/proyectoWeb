console.log("conexion exitosa");

document.addEventListener('DOMContentLoaded', function() {
    // Prueba para ver si funciona ya la gráfica
    const datosDashboard = {
        productosVendidos: [
            { producto: 'Galletas de Chocolate', ventas: 150 },
            { producto: 'Pastel de Vainilla', ventas: 120 },
            { producto: 'Cupcakes de Fresa', ventas: 95 },
            { producto: 'Brownies', ventas: 80 },
            { producto: 'Donas Glaseadas', ventas: 65 }
        ]
    };

    // Colores personalizados
    const colores = {
        fondo: [
            'rgba(209, 154, 154, 0.8)',
            'rgba(228, 179, 176, 0.8)',
            'rgba(217, 165, 161, 0.8)',
            'rgba(198, 138, 138, 0.8)',
            'rgba(181, 115, 115, 0.8)'
        ],
        borde: [
            'rgba(209, 154, 154, 1)',
            'rgba(228, 179, 176, 1)',
            'rgba(217, 165, 161, 1)',
            'rgba(198, 138, 138, 1)',
            'rgba(181, 115, 115, 1)'
        ]
    };

    // Contexto de productos
    const ctxProductos = document.getElementById('graficaProductos').getContext('2d');

    // Dibujar la grafica con el contexto
    new Chart(ctxProductos, {
        type: 'bar', // Grafica tipo de barras
        data: {
            // Datos de la grafica, los que ya definimos
            labels: datosDashboard.productosVendidos.map(item => item.producto),
            datasets: [{
                label: 'Ventas',
                data: datosDashboard.productosVendidos.map(item => item.ventas),
                backgroundColor: colores.fondo,
                borderColor: colores.borde,
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(90, 45, 45, 0.9)',
                    titleColor: 'white',
                    bodyColor: 'white'
                }
            },
            scales: {
                // Especificaciones
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(90, 45, 45, 0.1)'
                    },
                    ticks: {
                        color: '#5a2d2d'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#5a2d2d',
                        maxRotation: 45
                    }
                }
            }
        }
    });
});