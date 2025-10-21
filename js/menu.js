// Función para abrir o cerrar el menu
function toggleMenu() {
    const menu = document.getElementById("menu-lateral");
    const overlay = document.getElementById("menu-overlay");
    
    menu.classList.toggle("activo");
    overlay.classList.toggle("activo");
}

// Función para cerrar sesión
function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: "¿Estás seguro de que deseas salir?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d19a9a',
        cancelButtonColor: '#e4b3b0',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('sesion');
            window.location.href = '../index.html';
        }
    });
}

// Función para verificar sesión
function verificarSesion() {
    const sesionData = localStorage.getItem('sesion');
    
    // Existe y es valida
    if (!sesionData || sesionData === 'null' || sesionData === 'undefined') {
        console.log("No hay sesión activa, redirigiendo...");
        window.location.href = '../index.html';
        return null;
    }
    
    try {
        const sesion = JSON.parse(sesionData);
        console.log("Sesión activa:", sesion);
        return sesion;
    } catch (error) {
        console.error("Error al parsear sesión:", error);
        localStorage.removeItem('sesion');
        window.location.href = '../index.html';
        return null;
    }
}

// Cerrar menú al hacer clic en cualquier enlace del menú
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');

    // Verificar sesion
    verificarSesion();

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Aqui verificamos si el boton no es el de cerrar sesión si no lo es cierra el menu
            if (!e.target.closest('a').getAttribute('onclick')?.includes('cerrarSesion')) {
                toggleMenu();
            }
        });
    });
});