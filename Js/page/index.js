import { changePageTitle, mostarToastify, obtenerValor } from '../function.js'; // funciones generales de la aplicación
import { logIn as iniciar } from '../Data/firebase-auth.js' //importo el codigo de auth
import { colors } from '../enum.js';

changePageTitle("El Junco 1v"); // Cambiar nombre del titulo

document.getElementById("btnForm").addEventListener("click", function (event) {
    event.preventDefault()
    var email = obtenerValor("emailForm"); var password = obtenerValor("passForm");
    email != "" && password != "" ? iniciar(email, password) : mostarToastify('LLene los campos, por favor', colors.INF); // *condicion y ejecucion de login
});
