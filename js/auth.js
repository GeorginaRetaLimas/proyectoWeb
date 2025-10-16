// Ussers authentication
console.log("Conexión exitosa al script de autentificacion de usuarios");

// Variable global de usuario
let usuarios = [];

// Al momento de inicializar la página
document.addEventListener("DOMContentLoaded", function(){

    // Verificamos si la sesion esta activa para limpiarla
    if(localStorage.getItem('sesion')){
        localStorage.setItem('sesion', null);
    }

    // Verificamos usuarios en localStorage
    if(localStorage.getItem('usuarios')){
        usuarios = JSON.parse(localStorage.getItem('usuarios'));
        console.log("Usuarios obtenidos: ", usuarios);
    } else {
        console.log("No hay usuarios en localStorage");
        usuarios = [];
    }

    document.getElementById('form_Inicio').addEventListener('submit', function(e) {
        e.preventDefault();
    });

    // Cuando se envie el formulario de registro
    document.getElementById('form_Registro').addEventListener('submit', function(e) {
        e.preventDefault();

        if(validarRegistro){

        }
    });


});

function validarRegistro() {
    const nombreUsuario = document.getElementById("nombre_Usuario").value;
    const correo = document.getElementById("correo_registro").value;
    const contraseña = document.getElementById("contraseña_registro");
    const confirmar = document.getElementById("confirmar_registro");

    if (!nombreUsuario || !correo || !contraseña || !confirmar) {
        Swal.fire('Advertencia', 'Rellene todos los campos primero', 'warning');
        return false;
    }

    if (contraseña !== confirmar) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        Swal.fire('Error', 'Ingrese un correo electrónico válido', 'error');
        return false;
    }

    if (typeof usuarios !== 'undefined') {
        const usuarioExistente = usuarios.find(user => user.correo === correo);
        if (usuarioExistente) {
            Swal.fire('Error', 'Este correo ya está registrado', 'error');
            return false;
        }
    }

    return true;
}

document.getElementById('link_registro').addEventListener('click', function() {
    document.getElementById('vista_inicio').classList.add('d-none');
    document.getElementById('vista_registro').classList.remove('d-none');
});
        
document.getElementById('link_inicio').addEventListener('click', function() {
    document.getElementById('vista_registro').classList.add('d-none');
    document.getElementById('vista_inicio').classList.remove('d-none');
});