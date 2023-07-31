import { colors } from "../enum.js";
import { mostarToastify } from "../function.js";
import { app } from "./firebase-client.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const auth = getAuth(app); // *Initialize Firebase Authentication and get a reference to the service

///funcion para cerrar sesion del usuario
async function SignOut() {
    signOut(auth)
        .then(() => {
            mostarToastify("Hasta luego, vamos a extrañarte 😭", colors.WARNING);
            location.href = '/'; // Redirigir al usuario a index.html
        }).catch((error) => {
            console.error("error al cerrar sesion 😱");
        })
}

//TODO: Inicio de sesion con firebase y sus respectivas acciones
async function logIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // redireccionar a clinica
            alert(`Bienvenido! señor: ${user.email} sera rediregido a la clinica de guadañas`)
            location.href = "/clinica.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // Verificar el código de error
            if (errorCode === "auth/wrong-password") {
                // Contraseña incorrecta
                mostarToastify("Contraseña incorrecta. Por favor, verifica tu contraseña.", colors.ERROR);
            } else if (errorCode === "auth/invalid-email"){
                mostarToastify("El formato del correo es incorrecto.", colors.WARNING)
            } else {
                // Otro tipo de error
                console.error("Error durante el inicio de sesión:", errorMessage);
            }
        });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
            mostarToastify("Ya existe un usuario registrado", colors.WARNING)
            mostarToastify("redireccionando a la clinica", colors.CORRECT)
            setTimeout(() => {
                window.location.href = "/Clinica.html";
            }, 2000);
        }
    } else {
        if (window.location.pathname === "/Clinica.html" || window.location.pathname === "/Almacen.html") {
            mostarToastify("No existe un usuario registrado", colors.WARNING)
            mostarToastify("redireccionando al inicio de session", colors.CORRECT)
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        }
    }
})

export {
    logIn,
    SignOut
}