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

});

document.getElementById('form_Inicio').addEventListener('submit', function(e) {
    e.preventDefault();
});

// Cuando se envie el formulario de registro
document.getElementById('form_Registro').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombreUsuario = document.getElementById("nombre_Usuario").value;
    const correo = document.getElementById("correo_registro").value;
    const contraseña = document.getElementById("contraseña_registro").value;
    const confirmar = document.getElementById("confirmar_registro").value;

    console.log(nombreUsuario, correo, contraseña, confirmar);

    if (!nombreUsuario || !correo || !contraseña || !confirmar) {
        Swal.fire('Advertencia', 'Rellene todos los campos primero', 'warning');
        return;
    }

    if (contraseña !== confirmar) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        Swal.fire('Error', 'Ingrese un correo electrónico válido', 'error');
        return;
    }

    if (typeof usuarios !== 'undefined') {
        const usuarioExistente = usuarios.find(user => user.correo === correo);
        if (usuarioExistente) {
            Swal.fire('Error', 'Este correo ya está registrado', 'error');
            return;
        }
    }

    registrarUsuario(nombreUsuario, correo, contraseña);
});

function registrarUsuario(nombreUsuario, correo, contraseña){
    console.log("Creando nuevo usario: ", nombreUsuario);    

    const id = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id_usuario)) + 1 : 1;
    
    const nuevoUsuario = {
        id_usuario: id,
        username: nombreUsuario,
        correo: correo,
        contraseña: contraseña,
        rol: "usuario" 
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    Swal.fire('Éxito', 'Usuario registrado con éxito', 'success');
}


document.getElementById('link_registro').addEventListener('click', function() {
    document.getElementById('vista_inicio').classList.add('d-none');
    document.getElementById('vista_registro').classList.remove('d-none');
});
        
document.getElementById('link_inicio').addEventListener('click', function() {
    document.getElementById('vista_registro').classList.add('d-none');
    document.getElementById('vista_inicio').classList.remove('d-none');
});