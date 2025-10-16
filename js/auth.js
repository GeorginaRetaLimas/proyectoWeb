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

    const nombreUsuario = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value;

    const usuarioExiste = usuarios.find(user => user.username === nombreUsuario);

    if(usuarioExiste){
        if(usuarioExiste.contraseña === contraseña){
            console.log("Usuario autentificado: ", usuarioExiste);

            Swal.fire('Éxito', 'Usuario logueado con éxito', 'success');

            // Función para que después de 3 segundos mande a dashboard 
            setTimeout(function() {
                console.log("Redirigiendo a dashboard...");
                window.location.href = "dashboard.html";
            }, 3000);
        } else {
            console.log(usuarioExiste);
            Swal.fire('Error', 'Contraseña incorrecta', 'error');
        }
    } else {
        Swal.fire('Error', 'Datos incorrectos', 'error');
    }
});

// Cuando se envie el formulario de registro
document.getElementById('form_Registro').addEventListener('submit', function(e) {
    e.preventDefault();

    // Nos traemos los datos del html
    const nombreUsuario = document.getElementById("nombre_Usuario").value;
    const correo = document.getElementById("correo_registro").value;
    const contraseña = document.getElementById("contraseña_registro").value;
    const confirmar = document.getElementById("confirmar_registro").value;

    console.log(nombreUsuario, correo, contraseña, confirmar);

    // Validacion de si los datos son vacios
    if (!nombreUsuario || !correo || !contraseña || !confirmar) {
        Swal.fire('Advertencia', 'Rellene todos los campos primero', 'warning');
        return;
    }

    // Si la contraseña o la confirmación coinciden
    if (contraseña !== confirmar) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        return;
    }

    // Si el email es valido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        Swal.fire('Error', 'Ingrese un correo electrónico válido', 'error');
        return;
    }

    // Si no existe nada en usuarios no valida el correo
    if (typeof usuarios !== 'undefined') {
        // validacion de si el correo existe
        const correoExistente = usuarios.find(user => user.correo === correo);
        if (correoExistente) {
            Swal.fire('Error', 'Este correo ya está registrado', 'error');
            return;
        }

        // validacion de si el username ya existe
        const usuarioExistente = usuarios.find(user => user.username === nombreUsuario);
        if (usuarioExistente) {
            Swal.fire('Error', 'Este nombre de usuario ya está registrado', 'error');
            return;
        }
    }

    // Si todo esta bien manda a regitrar el usuario
    registrarUsuario(nombreUsuario, correo, contraseña);
});

// Registro de usuario
function registrarUsuario(nombreUsuario, correo, contraseña){
    console.log("Creando nuevo usario: ", nombreUsuario);    

    // Obtenemos un nuevo id
    const id = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id_usuario)) + 1 : 1;
    
    // Creamos un nuevo Usuario
    const nuevoUsuario = {
        id_usuario: id,
        username: nombreUsuario,
        correo: correo,
        contraseña: contraseña,
        rol: "usuario" 
    };

    // Lo añadimos al array y al localStorage
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    console.log("Nuevo registro: ", nuevoUsuario);
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