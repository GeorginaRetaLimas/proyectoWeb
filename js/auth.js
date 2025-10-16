// Ussers authentication
console.log("Conexión exitosa al script de autentificacion de usuarios");

// Variable global de usuario
let usuarios = [];

// Constantes de las vistas
const vistaInicio = document.getElementById('vista_inicio');
const vistaRegistro = document.getElementById('vista_registro');

var inicioActivo;

// Al momento de inicializar la página
document.addEventListener("DOMContentLoaded", function(){

    // Verificamos si la sesion esta activa para limpiarla
    if(localStorage.getItem('sesion')){
        localStorage.setItem('sesion', null);
    }

    // Verificamos si estamos viendo el moal de inicio o registro
    if(localStorage.getItem('inicioActivo') === true){
        activarVistaInicio();
    } else {
        activarVistaRegistro();
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

function validarRegistro(){
    const nombreUsuario = document.getElementById("nombre_Usuario").value;
    const correo = document.getElementById("correo_registro").value;
    const contraseña = document.getElementById("contraseña_registro").value;
    const confirmar = document.getElementById("confirmar_registro").value;

    if(nombreUsuario === "" || correo === "" || contraseña === "" || confirmar === ""){
        alert("No puede mandar campos vacios");
        return false;
    }

    if(nombreUsuario){

    }

    // Ver
    const usuarioExistente = usuarios.find(user => user.correo === correo);
    if(nombreUsuario){

    }

    return true;
}