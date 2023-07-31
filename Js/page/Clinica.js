import { changePageTitle, navbarCod, inyhtm, limpiarCampo, habDeshabiBoton, mostarToastify, tbodyCod, exitSession, cleanHtml, insertText, tbodyCodVacio, insertValueText } from "../function.js"; // *funciones generales de la aplicación
import { opcInsert, colors, estados } from "../enum.js";
import { actEstado, actualizaciones, actualizarPaciente, agregarClinica, eliminarPaciente, pacientesEspera, pacientesProceso, pacientesTerminado } from "../Data/firebase-firestore-clinica.js";

changePageTitle("El Junco | CLINICA"); // *Cambiar nombre del titulo

var eventEdit = false;

var pacienteID;
let pacienteEstado;
let pacienteNameDueño;
let pacienteCedula;
let pacienteTelefono;
let pacienteDireccion;
let pacienteMarca;
let pacienteNumeroSerie;
let pacienteFechaIngreso;
let pacienteObservacionInicial;

let selectTabla = estados.ESPERA; // variable que controla la actualizacion de la tabla en tiempo real

const inputEditId = ["nombreDueñoEdit", "cedulaDueñoEdit", "telefonoDueñoEdit", "direccionDueñoEdit", "fechaIngresoEdit", "marcaMaquinaEdit", "numeroSerieEdit", "observacionesEdit"];
//activar escucha de actualizaciones de data
actualizaciones();

// *codiogo para el menu
inyhtm("navbar", opcInsert.BEFORE_END, navbarCod("clinica"));

// Obtener referencia al botón "Guardar" y "Limpiar"
const btnGuardar = document.getElementById("btnGuardar");
const btnLimpiar = document.getElementById("btnLimpiar");

// agregar eventos de clcik al btn limpiar
btnLimpiar.addEventListener("click", limpiarForm);

// Agregar el evento de clic al botón "Guardar"
btnGuardar.addEventListener("click", function (event) {
    event.preventDefault();
    // Obtener los valores de los campos del formulario
    const nombreDueño = document.getElementById("nombreDueño").value.trim();
    const cedulaDueño = parseInt(
        document.getElementById("cedulaDueño").value,
        10
    );
    const telefonoDueño = document.getElementById("telefonoDueño").value;
    const direccionDueño = document.getElementById("direccionDueño").value.trim();
    const fechaIngreso = document.getElementById("fechaIngreso").value.trim();
    const marcaMaquina = document.getElementById("marcaMaquina").value.trim();
    const numeroSerie = document.getElementById("numeroSerie").value.trim();
    const observaciones = document.getElementById("observaciones").value.trim();

    //verificar que no esten vacios
    if (
        nombreDueño === "" ||
        isNaN(cedulaDueño) ||
        telefonoDueño === "" ||
        direccionDueño === "" ||
        fechaIngreso === "" ||
        marcaMaquina === "" ||
        numeroSerie === ""
    ) {
        mostarToastify("😰 Complete los campos para continuar", colors.WARNING);
        return false;
    }

    // Llamar a la función agregarClinica() con los datos obtenidos
    habDeshabiBoton("btnGuardar", true);
    agregarClinica(
        nombreDueño,
        cedulaDueño,
        telefonoDueño,
        direccionDueño,
        fechaIngreso,
        marcaMaquina,
        numeroSerie,
        observaciones
    );
    return true;
});

///Editar paciente 
const btnGuardarEdit = document.getElementById('btnGuardarEdit');
btnGuardarEdit.addEventListener('click', function (event) {
    event.preventDefault();
    // Obtener los valores de los campos del formulario
    const nombreDueño = document.getElementById("nombreDueñoEdit").value.trim();
    const cedulaDueño = parseInt(
        document.getElementById("cedulaDueñoEdit").value,
        10
    );
    const telefonoDueño = document.getElementById("telefonoDueñoEdit").value;
    const direccionDueño = document.getElementById("direccionDueñoEdit").value.trim();
    const fechaIngreso = document.getElementById("fechaIngresoEdit").value.trim();
    const marcaMaquina = document.getElementById("marcaMaquinaEdit").value.trim();
    const numeroSerie = document.getElementById("numeroSerieEdit").value.trim();
    const observaciones = document.getElementById("observacionesEdit").value.trim();

    //verificar que no esten vacios
    if (
        nombreDueño === "" ||
        isNaN(cedulaDueño) ||
        telefonoDueño === "" ||
        direccionDueño === "" ||
        fechaIngreso === "" ||
        marcaMaquina === "" ||
        numeroSerie === ""
    ) {
        mostarToastify("No puede quedar ningun dato vacio 😟", colors.WARNING);
        return false;
    }

    // Llamar a la función actualizar() con los datos obtenidos
    actualizarPaciente(
        pacienteID,
        nombreDueño,
        cedulaDueño,
        telefonoDueño,
        direccionDueño,
        fechaIngreso,
        marcaMaquina,
        numeroSerie,
        observaciones
    ).then(() => {
        editDetalles.style.display = "none";
        detallesDueño.style.display = "block";
    });
    return true;
});

///funcion que al obtener los datos genera las funciones y html necesario
function pacientesTabla(pacientesDta) {
    const pacientes = pacientesDta;
    if (pacientes.length === 0) {
        cleanHtml("tbody");
        inyhtm("tbody", opcInsert.BEFORE_END, tbodyCodVacio());
    } else {
        pacientes.forEach((paciente, index) => {
            inyhtm(
                "tbody",
                opcInsert.BEFORE_END,
                tbodyCod(
                    index + 1,
                    paciente.nameDueño,
                    paciente.numeroSerie,
                    paciente.marcaMaquina,
                    paciente.fechaIngreso
                )
            );
        });

        //btn click funcion
        var botonesFuncion = document.getElementsByClassName("btnFuncion");
        const lengthArrys = botonesFuncion.length;

        for (let e = 0; e < lengthArrys; e++) {
            const paciente = pacientes[e];
            const btn = botonesFuncion[e];

            btn.addEventListener("click", function () {
                offCanvasDetalles(
                    paciente.id,
                    paciente.estado,
                    paciente.nameDueño,
                    paciente.cedula,
                    paciente.telefonoDueño,
                    paciente.direccionDueño,
                    paciente.marcaMaquina,
                    paciente.numeroSerie,
                    paciente.fechaIngreso,
                    paciente.fechaSalida,
                    paciente.observacionesIniciales
                );
            });
        }
    }
}

///evento y funcion para cada btn de card (espera, pacientes, terminados)
const btnEspera = document.getElementById("btnEspera");
const btnProceso = document.getElementById("btnProceso");
const btnTerminado = document.getElementById("btnTerminados");

//accion al darle click a trabajar pacientes en espera
btnEspera.addEventListener("click", (event) => {
    event.preventDefault();
    selectTabla = estados.ESPERA;
    cleanHtml("tbody"); // se limpia la tabla
    pacientesTabla(pacientesEspera); // se hace la consulta y se esribe en la tabla
});

//accion al darle click a trabajar paciente en proceso
btnProceso.addEventListener("click", (event) => {
    event.preventDefault();
    selectTabla = estados.PROCESO;
    cleanHtml("tbody"); // se limpia la tabla
    pacientesTabla(pacientesProceso); // se hace la consulta y se esribe en la tabla
});

//accion al darle click a trabajar paciente en proceso
btnTerminado.addEventListener("click", (event) => {
    event.preventDefault();
    selectTabla = estados.TERMINADO;
    cleanHtml("tbody"); // se limpia la tabla
    pacientesTabla(pacientesTerminado); // se hace la consulta y se esribe en la tabla
});

///offCanvas ver detalles
function offCanvasDetalles(id, estado, nameDueño, cedula, telefonoDueño, direccionDueño, marcaMaquina, numeroSerie, fechaIngreso, fechaSalida, observaciones) {
    pacienteEstado = estado;
    pacienteID = id;
    pacienteNameDueño = nameDueño;
    pacienteCedula = cedula;
    pacienteTelefono = telefonoDueño;
    pacienteDireccion = direccionDueño;
    pacienteMarca = marcaMaquina;
    pacienteNumeroSerie = numeroSerie;
    pacienteFechaIngreso = fechaIngreso;
    pacienteObservacionInicial = observaciones;

    //insertar detalles
    insertText("estadoDet", estado);
    insertText("nameDueñoDet", nameDueño);
    insertText("cedulaDueñoDet", cedula);
    insertText("telefonoDueñoDet", telefonoDueño);
    insertText("direccionDueñoDet", direccionDueño);
    insertText("marcaMaquinaDet", marcaMaquina);
    insertText("numeroSerieDet", numeroSerie);
    insertText("fechaIngresoDet", fechaIngreso);
    //insertar texto a los input de EditForm
    insertValueText("nombreDueñoEdit", nameDueño);
    insertValueText("cedulaDueñoEdit", cedula);
    insertValueText("telefonoDueñoEdit", telefonoDueño);
    insertValueText("direccionDueñoEdit", direccionDueño);
    insertValueText("fechaIngresoEdit", fechaIngreso);
    insertValueText("marcaMaquinaEdit", marcaMaquina);
    insertValueText("numeroSerieEdit", numeroSerie);
    insertValueText("observacionesEdit", observaciones);


    const observacionesElem = document.getElementById("observacionesInicialDet");
    observaciones === "" || observaciones == null
        ? (observacionesElem.textContent = "Ninguna observacion.")
        : (observacionesElem.textContent = observaciones);

    const btnSigEstado = document.getElementById("offActualizarEst");
    //Estilo para estadoDet segun su estado
    switch (estado) {
        case estados.PROCESO:
            document.getElementById("estadoDet").style.backgroundColor = "#FC7A1E";
            break;
        case estados.TERMINADO:
            document.getElementById("estadoDet").style.backgroundColor = "#1985A1";
            break;
        default:
            document.getElementById("estadoDet").style.backgroundColor = "#DB3A34";
            break;
    }
    //Estilos del boton sig. estado en caso de cada estado
    switch (estado) {
        case estados.ESPERA:
            insertText("offActualizarEst", estados.PROCESO);
            inyhtm("offActualizarEst", opcInsert.BEFORE_END, ` <i class="bi bi-chevron-bar-right"></i>`
            );
            btnSigEstado.style.backgroundColor = "#FC7A1E";
            btnSigEstado.style.borderColor = "#FC7A1E";

            btnSigEstado.onmouseover = () => {
                btnSigEstado.style.backgroundColor = "#F0F7EE";
                btnSigEstado.style.color = "#FC7A1E";
            };
            btnSigEstado.onmouseout = () => {
                btnSigEstado.style.backgroundColor = "#FC7A1E";
                btnSigEstado.style.color = "#F0F7EE";
            };
            break;
        case estados.PROCESO:
            insertText("offActualizarEst", estados.TERMINADO);
            inyhtm(
                "offActualizarEst",
                opcInsert.BEFORE_END,
                ` <i class="bi bi-chevron-bar-right"></i>`
            );
            btnSigEstado.style.backgroundColor = "#1985A1";
            btnSigEstado.style.borderColor = "#1985A1";

            btnSigEstado.onmouseover = () => {
                btnSigEstado.style.backgroundColor = "#F0F7EE";
                btnSigEstado.style.color = "#1985A1";
            };
            btnSigEstado.onmouseout = () => {
                btnSigEstado.style.backgroundColor = "#1985A1";
                btnSigEstado.style.color = "#F0F7EE";
            };
            break;
        case estados.TERMINADO:
            insertText("offActualizarEst", "Pagar");
            inyhtm(
                "offActualizarEst",
                opcInsert.BEFORE_END,
                ` <i class="bi bi-chevron-bar-right"></i>`
            );
            btnSigEstado.style.backgroundColor = "#04151F";
            btnSigEstado.style.borderColor = "#04151F";

            btnSigEstado.onmouseover = () => {
                btnSigEstado.style.backgroundColor = "#F0F7EE";
                btnSigEstado.style.color = "#04151F";
            };
            btnSigEstado.onmouseout = () => {
                btnSigEstado.style.backgroundColor = "#04151F";
                btnSigEstado.style.color = "#F0F7EE";
            };
            break;
        default:
            break;
    }
}

//funcion y elementos necesarios
//para actualizar el estado
const offActualizarEst = document.getElementById("offActualizarEst");
offActualizarEst.addEventListener("click", function () {
    let sigEstado;

    habDeshabiBoton("offActualizarEst", true)
    pacienteEstado != estados.PROCESO
        ? (sigEstado = estados.PROCESO)
        : (sigEstado = estados.TERMINADO);
    pacienteEstado == estados.TERMINADO
        ? mostarToastify("estamos en estado Terminado")
        : actEstado(pacienteID, sigEstado);
});

//!edicion del paciente
//acciones para editar el paciente
const offCanvasEdit = document.getElementById("offCanvasEdit");
const editDetalles = document.getElementById("editarDetalles");
const detallesDueño = document.getElementById("mostrarDetalles");
offCanvasEdit.addEventListener("click", function () {
    if (editDetalles.style.display === "" || editDetalles.style.display === "none") {
        mostrarEditForm();
    }

    // TODO: funcion para cancelar edicion si se sale del offcanvasfuntabla
    // Obtener referencia al elemento HTML en el que se hace clic fuera
    var offcanvasfuntabla = document.getElementById("offcanvasfuntablaproduc");

    document.addEventListener("click", clicFuera);
    // Agregar evento de clic al documento
    function clicFuera(event) {
        var targetElement = event.target; // Elemento en el que se hizo clic
        // Verificar si el elemento en el que se hizo clic está dentro del elemento objetivo
        if (!offcanvasfuntabla.contains(targetElement)) {
            // El clic se realizó fuera del elemento, ejecutar la función aquí
            ocultarDetallesDueños();
            // Eliminar el evento de clic después de ejecutar la función
            document.removeEventListener("click", clicFuera);
        }
    }

    function ocultarDetallesDueños() {
        editDetalles.style.display = "none";
        detallesDueño.style.display = "block";
    }

    function mostrarEditForm() {
        habDeshabiBoton("btnGuardarEdit", true);
        editDetalles.style.display = "block";
        detallesDueño.style.display = "none";

        if (!eventEdit) {
            inputEditId.forEach((id, index) => {
                const inputElement = document.getElementById(id);
                inputElement.addEventListener('input', (event) => { changeInput(event, index) });
            });

            eventEdit = true;
        }
    }
});

//función para verificar  
function changeInput(event, index) {
    const inputEditValue = [pacienteNameDueño, pacienteCedula, pacienteTelefono, pacienteDireccion, pacienteFechaIngreso, pacienteMarca, pacienteNumeroSerie, pacienteObservacionInicial];
    const nuevoValue = event.target.value;
    if (nuevoValue) {
        if (nuevoValue != inputEditValue[index]) {
            habDeshabiBoton("btnGuardarEdit");
        } else {
            habDeshabiBoton("btnGuardarEdit", true);
        }
    }
}
//acciones para cancelar la edicion del paciente
const btnCancelarEdit = document.getElementById("btnCancelarEdit");
btnCancelarEdit.addEventListener("click", function () {
    if (detallesDueño.style.display === "none" || detallesDueño.style.display === "") {
        mostrarDetallesDueño();
    }

    ///funciones
    function mostrarDetallesDueño() {
        editDetalles.style.display = "none";
        detallesDueño.style.display = "block";
        //insertar texto a los input de EditForm
        insertDatosInputs()
    }
});

///accion para limpiar el formulario Edit
const btnLimpiarEdit = document.getElementById("btnLimpiarEdit");
btnLimpiarEdit.addEventListener('click', function () {
    habDeshabiBoton("btnGuardarEdit", true);
    insertDatosInputs()
    //mensaje orientador
    mostarToastify("Todo como antes 🤗", colors.INF)
})

function insertDatosInputs() {
    //insertar texto a los input de EditForm
    insertValueText("nombreDueñoEdit", pacienteNameDueño);
    insertValueText("cedulaDueñoEdit", pacienteCedula);
    insertValueText("telefonoDueñoEdit", pacienteTelefono);
    insertValueText("direccionDueñoEdit", pacienteDireccion);
    insertValueText("fechaIngresoEdit", pacienteFechaIngreso);
    insertValueText("marcaMaquinaEdit", pacienteMarca);
    insertValueText("numeroSerieEdit", pacienteNumeroSerie);
    insertValueText("observacionesEdit", pacienteObservacionInicial);
}

//!eliminar los pacientes
const offEliminarPac = document.getElementById("offEliminarPac");
offEliminarPac.addEventListener("click", function () {
    habDeshabiBoton("offEliminarPac", true);
    eliminarPaciente(pacienteID);
});

// funcion cant. Pacientes
function mostrarCantPaciente(id, cant) {
    insertText(id, cant);
}

// *Limpiar campos del formulario
function limpiarForm() {
    limpiarCampo("nombreDueño");
    limpiarCampo("telefonoDueño");
    limpiarCampo("cedulaDueño");
    limpiarCampo("fechaIngreso");
    limpiarCampo("direccionDueño");
    limpiarCampo("marcaMaquina");
    limpiarCampo("numeroSerie");
    limpiarCampo("observaciones");

    mostarToastify("Formulario limpio", colors.CORRECT);
}

// *Limpiar campos del formulario Edit
function limpiarFormEdit() {
    limpiarCampo("nombreDueñoEdit");
    limpiarCampo("telefonoDueñoEdit");
    limpiarCampo("cedulaDueñoEdit");
    limpiarCampo("fechaIngresoEdit");
    limpiarCampo("direccionDueñoEdit");
    limpiarCampo("marcaMaquinaEdit");
    limpiarCampo("numeroSerieEdit");
    limpiarCampo("observacionesEdit");

    mostarToastify("Formulario limpio", colors.CORRECT);
}

//! Reloj y Fecha del banner del clinica
// Obtener referencia al elemento con el ID "containerClock"
const containerClock = document.getElementById("containerClock");

// Convertir la primera letra de una cadena en mayúscula
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Verificar si el elemento es visible en la ventana actual
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;

    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

    return (vertInView && horInView);
}

// Actualizar el reloj y la fecha cada segundo si el elemento es visible
function updateClockAndDate() {
    const clockElement = document.getElementById("clock");
    const dateElement = document.getElementById("data");

    if (isElementVisible(containerClock)) {
        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const amPm = hours >= 12 ? "PM" : "AM";

        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, "0");

        const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
        const dateString = currentDate.toLocaleDateString("es-ES", options);
        const formattedDate = capitalizeFirstLetter(dateString);

        clockElement.textContent = `${formattedHours}:${formattedMinutes} ${amPm}`;
        dateElement.textContent = formattedDate
    }
}

// Actualizar cada segundo
setInterval(updateClockAndDate, 1000);
//!fin del codigo de Reloj y Fecha

///llamado a la funcion del click exitSession
exitSession();

///scroll en posicion 0 permitiendo ver el menu
window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
});

export {
    limpiarForm,
    mostrarCantPaciente,
    selectTabla,
    pacientesTabla,
    pacienteID,
    offCanvasDetalles,
};
