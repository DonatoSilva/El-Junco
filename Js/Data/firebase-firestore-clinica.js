import { app } from "./firebase-client.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { cleanHtml, habDeshabiBoton, hideOffcanvas, mostarToastify } from "../function.js";
import { colors, estados } from "../enum.js";
import { limpiarForm, mostrarCantPaciente, offCanvasDetalles, pacienteID, pacientesTabla, selectTabla } from "../page/Clinica.js";

// Obtén una instancia de Cloud Firestore
const db = getFirestore(app);

//varianle globales para pacientes
let pacientesEspera = [];
let pacientesProceso = [];
let pacientesTerminado = [];

// Función para agregar un documento a la colección "clínica" con la subcolección "factura"
async function agregarClinica(dueño, cedula, telefono, direccion, fechaIngreso, marca, numeroSerie, observaciones) {
    try {
        const docRef = await addDoc(collection(db, 'Clínica'), {
            dueño: dueño,
            cedula: cedula,
            telefono: telefono,
            direccion: direccion,
            fechaIngreso: fechaIngreso,
            fechaSalida: null,
            marca: marca,
            numeroSerie: numeroSerie,
            estado: "Espera",
            observacionesIniciales: observaciones
        });

        limpiarForm();
        mostarToastify("Paciente generado correctamente", colors.CORRECT);
        // Agrega la subcolección "factura" dentro del documento "clínica"
        await agregarFactura(docRef);

    } catch (error) {
        console.error('Error al agregar el documento: ', error);
    }
}

// Función para agregar la subcolección "factura" dentro del documento "clínica"
async function agregarFactura(docRef) {
    try {
        const facturaRef = addDoc(collection(docRef, 'factura'), {
            Id_Stock: null,
            Cant: null,
            Precio_Total: null
        });

        habDeshabiBoton("btnGuardar");
    } catch (error) {
        habDeshabiBoton("btnGuardar");
        console.error('Error al agregar la subcolección "factura": ', error);
    }
}

//funcion para actualizar estado del paciente
async function actEstado(id, valor) {
    // Obtener la referencia del documento que deseas actualizar
    const docRef = doc(collection(db, 'Clínica'), id);

    updateDoc(docRef, {
        estado: valor
    })
        .then(() => {
            habDeshabiBoton("offActualizarEst")
            mostarToastify('Campo actualizado correctamente', colors.CORRECT);
        })
        .catch((error) => {
            habDeshabiBoton("offActualizarEst")
            mostarToastify("Se presento un error al actualizar... 😭😱", colors.ERROR);
            console.error('Error al actualizar el campo:', error);
        });
}

//editar datos del paciente
async function actualizarPaciente(id, dueño, cedula, telefono, direccion, fechaIngreso, marca, numeroSerie, observaciones) {
    try {
        const docRef = doc(db, "Clínica", id);
        await updateDoc(docRef, {
            dueño: dueño,
            cedula: cedula,
            telefono: telefono,
            direccion: direccion,
            fechaIngreso: fechaIngreso,
            marca: marca,
            numeroSerie: numeroSerie,
            observacionesIniciales: observaciones,
        });

        habDeshabiBoton("btnGuardarEdit");
        mostarToastify("Paciente actualizado exitosamente", colors.CORRECT);
    } catch (error) {
        habDeshabiBoton("btnGuardarEdit");
        mostarToastify("Se presento un error al actualizar... 😰", colors.ERROR);
        console.error("Error al actualizar el documento:", error);
    }
}


//funcion para eliminar los pacientes que se necesite
async function eliminarPaciente(pacienteId) {
    try {
        const pacienteRef = doc(db, 'Clínica', pacienteId);

        // Obtener el nombre del paciente antes de eliminarlo
        const pacienteSnapshot = await getDoc(pacienteRef);
        const pacienteName = pacienteSnapshot.data().dueño;

        // !Eliminar paciente
        await deleteDoc(pacienteRef);
        eliminarFactura(pacienteRef);

        //demas acciones
        mostarToastify(`Paciente eliminado correctamente: ${pacienteName}`, colors.WARNING); //notificar que todo salio exitoso
        hideOffcanvas('offcanvasfuntablaproduc'); // se oculta el offcanvas
    } catch (error) {
        console.error('Error al eliminar el paciente: ', error);
    }
}

///eliminacion de la factura completa (complemento de eliminarPaciente)
async function eliminarFactura(pacienteRef) {
    try {
        //consulta dentro de la coleccion padre para obtener toda la factura de un paciente
        const subcoleccionSnapshot = await getDocs(collection(pacienteRef, 'factura'));
        // Itera sobre los documentos de la subcolección y elimínalos uno por uno
        subcoleccionSnapshot.forEach((subdoc) => {
            deleteDoc(subdoc.ref);
        });

        mostarToastify("Se elimino correctamente la factura.", colors.CORRECT);
        habDeshabiBoton("offEliminarPac");
    } catch (error) {
        console.error("error al eliminar factura:", error)
    }

}

///Mantiene la información de la pagina actualizada
/* TODO: ***hay mejorar el rendimiento, pues al actualizar toda la informacion 
al mismo tiempo cada vez gastamos memoria sin necesidad,
Dicha mejora se espera para despues del pre-lanzamiento.*/
async function actualizaciones() {
    const unsubscribe = onSnapshot(collection(db, "Clínica"), (snapshot) => {
        pacientesEspera.splice(0, pacientesEspera.length);
        pacientesProceso.splice(0, pacientesProceso.length);
        pacientesTerminado.splice(0, pacientesTerminado.length)

        var cantEspera = 0;
        var cantProceso = 0;
        var cantTerminado = 0;

        if (pacienteID != null) {
            snapshot.docChanges().forEach((change) => {
                // Verificar el tipo de cambio (añadido)
                var paciente = change.doc.data();
                if (change.type === 'modified') {
                    if (change.doc.id === pacienteID) {
                        offCanvasDetalles(pacienteID, paciente.estado, paciente.dueño, paciente.cedula, paciente.telefono, paciente.direccion, paciente.marca, paciente.numeroSerie, paciente.fechaIngreso, paciente.fechaSalida, paciente.observacionesIniciales);
                    }
                }
            });
        }

        snapshot.forEach((paciente) => {
            const data = paciente.data();
            const docPaciente = {
                id: paciente.id,
                estado: data.estado,
                nameDueño: data.dueño,
                cedula: data.cedula,
                telefonoDueño: data.telefono,
                direccionDueño: data.direccion,
                fechaIngreso: data.fechaIngreso,
                fechaSalida: data.fechaSalida,
                marcaMaquina: data.marca,
                numeroSerie: data.numeroSerie,
                observacionesIniciales: data.observacionesIniciales
            }

            switch (data.estado) {
                case estados.ESPERA:
                    cantEspera++
                    pacientesEspera.push(docPaciente)
                    break;
                case estados.PROCESO:
                    cantProceso++
                    pacientesProceso.push(docPaciente)
                    break;
                case estados.TERMINADO:
                    cantTerminado++
                    pacientesTerminado.push(docPaciente)
                    break;
                default:
                    console.log("existe la posibilida que no cuadre algo")
                    break;
            }
        })

        switch (selectTabla) {
            case estados.ESPERA:
                cleanHtml("tbody"); // se limpia la tabla 
                pacientesTabla(pacientesEspera);
                break;
            case estados.PROCESO:
                cleanHtml("tbody"); // se limpia la tabla 
                pacientesTabla(pacientesProceso);
                break;
            case estados.TERMINADO:
                cleanHtml("tbody"); // se limpia la tabla 
                pacientesTabla(pacientesTerminado);
                break;
            default:
                console.log("Que intentas hacer?");
                break;
        }

        mostrarCantPaciente('cantEspera', cantEspera);
        mostrarCantPaciente('cantProceso', cantProceso);
        mostrarCantPaciente('cantTerminado', cantTerminado)
    });

    // Devolver función para cancelar la escucha
    return () => unsubscribe();
}

export {
    agregarClinica,
    actualizarPaciente,
    eliminarPaciente,
    actEstado,
    actualizaciones,
    pacientesEspera, pacientesProceso, pacientesTerminado
}