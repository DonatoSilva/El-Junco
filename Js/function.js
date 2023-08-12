import { SignOut } from "./Data/firebase-auth.js";

// *funcion para cambiar el titulo de las pestañas
function changePageTitle(name) {
    document.title = name;
}

// *funcion para inyectar codigo html en el Dom y asi poder reutilizar cierto codigo
function inyhtm(elementId, opcInsert, codhtm) {
    const element = document.getElementById(elementId);
    element.insertAdjacentHTML(opcInsert, codhtm);
}

//funcion que retorna el cod htm para mostrar el listado de Kits
function itemKitCod(nombre, cantProx, precio) {
    const cod = `<li class="list-group-item list-group-item-action pe-0 ps-0">
                                <div class="row">
                                    <div class="col-6 border-end border-secondary m-auto"
                                        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nombre}</div>
                                    <div class="col-2 border-end border-secondary m-auto">
                                        ${cantProx} <span class="small fw-light">Kits</span>
                                    </div>
                                    <div class="col-2 border-end border-secondary m-auto">
                                        <span class="small fw-light">$ </span>${precio}
                                    </div>
                                    <div class="col-2 p-1" style="height: min-content;">
                                        <button type="button" class="btn btn-agregar p-1 me-1"
                                            style="font-size: small; width: 90%;" data-bs-toggle="offcanvas" href="#offcanvasKits" role="button" aria-controls="offcanvasKits"><i
                                                class="bi bi-three-dots-vertical"></i></button>
                                    </div>
                                </div>
                            </li>`
    return cod
}

//retorna el codigo correspondiente para el cuerpo de la tabla
function tbodyCod(index, opcion1, opcion2, opcion3, opcion4) {
    const tbody = `<tr>
                        <th scope="ro">${index}</th>
                        <td>${opcion1}</td>
                        <td>${opcion2}</td>
                        <td>${opcion3}</td>
                        <td>${opcion4}</td>
                        <td>
                            <a class="btn btnFuncion" type="button" data-bs-toggle="offcanvas" href="#offcanvasfuntablaproduc"
                                role="button" aria-controls="offcanvasfuntablaproduc"><i class="bi bi-gear"></i></a>
                        </td>
                    </tr>`

    return tbody;
}

function codGruopKit(count) {
    const kit = "Kit-" + count;

    const code = count == 0 ? `<h5 class="w-100 text-center opacity-50" id="textVacioGroup">Ningún producto</h5>` : `<div class="w-100 p-0 d-flex selecAsh">
    <div class="col-7">
        <select class="form-select" aria-label="Tipo de unidad"
            style="border-top-right-radius: 0px; border-bottom-right-radius: 0px;" id="select${kit}">
            <option selected>Selecciona</option>
        </select>
    </div>
    <div class="col-4">
        <input type="number" name="UnidadProd" class="form-control rounded-0" placeholder="Unidades">
    </div>
    <button type="button" class="btn btn-eliminar col-1 pe-0 ps-0 rounded-start-0 btnQuitarKit" id='delete${kit}'><i class="bi bi-trash3"></i></i></button>
</div>`;

    return [code, kit];
}

///retorna el codigo diseñado para cuando la tabla este vacia
function tbodyCodVacio() {
    const tbody = `<tr>
                        <td colspan="6" class="align-middle text-center " style="padding: 48px 12px; opacity: 50%;">
                            <div class="d-flex justify-content-center mt-2"><img src="/Media/Img/undraw_no_data_re_kwbl.svg" alt="sin pacientes" style="max-width: 100px; width: 80%; margin-bottom: 12px; opacity: 50%;"></div>
                            <hr style="max-width: 250px; width: 65%; margin: auto; opacity: 50%;" class="w-100 text-center">
                            <h5 style="padding-top: 5px; opacity: 50%;" class="text-center">Nada por el momento</h5>
                        </td>
                    </tr>`
    return tbody;
}

function itemMinProduct(nombre, cantActual, cantMin) {
    const code = `<li class="list-group-item list-group-item-action pe-0 ps-0">
                <div class="row">
                    <div class="col-6 border-end border-secondary m-auto"
                        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nombre}</div>
                    <div class="col-2 border-end border-secondary m-auto">
                        ${cantMin} <span class="small fw-light">Und</span>
                    </div>
                    <div class="col-2 border-end border-secondary m-auto">
                        ${cantActual} <span class="small fw-light">Und</span>
                    </div>
                    <div class="col-2 p-1" style="height: min-content;">
                        <button type="button" class="btn btn-agregar small p-1 me-1 btnFuncionMinProduct"
                            style="font-size: small; width: 90%;" data-bs-toggle="offcanvas" href="#offcanvasfuntablaproduc"
                            role="button" aria-controls="offcanvasfuntablaproduc"><i
                                class="bi bi-three-dots-vertical"></i></button>
                    </div>
                </div>
            </li>`
            
    return code
}

//retorna el codigo correspondiente del menu
function navbarCod(opcion) {
    if (opcion == 'clinica') {
        var actClinica = "active"
        var active = ""
    } else {
        var active = "active"
        var actClinica = ""
    }

    const navCodigo = `<!--*Menu de la pag, se genere por js para si reducir repeticiones de codigo html-->
        <nav class="navbar navbar-expand-lg navbar bg-dark border-bottom border-bottom-dark" data-bs-theme="dark">    
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="/Clinica.html">El Junco</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link ${actClinica}" aria-current="page" href="/Clinica.html"><i class="bi bi-hospital"></i> Clinica</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${active}" href="/Almacen.html"><i class="bi bi-archive"></i> Almacen</a>
                        </li>
                        <li class="nav-item" >
                            <a class="nav-link" id="exitSession" href="#"><i class="bi bi-box-arrow-left"></i> Cerrar sesion</a>
                        </li>
                    </ul>
                    <form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Search"
                            style="background-color: #ffff;">
                        <button class="btn btn-outline-junco fw-bold" type="submit"><i class="bi bi-search"></i></button>
                    </form>
                </div>
            </div>
        </nav>`;

    return navCodigo;
}

// *Funcion para obtener el valor que contiene un elemento y retornarlo por su ID
function obtenerValor(id) {
    var elemento = document.getElementById(id);
    if (elemento) {
        return elemento.value;
    } else {
        console.error(id, "No existe")
    }
}


//funcion para habilitar o inabilitar el click por ID
function habDeshabiBoton(id, interruntor) {
    const miBoton = document.getElementById(id);

    if (interruntor) {
        miBoton.disabled = true;
    } else {
        miBoton.disabled = false;
    }
}

// funcion para limbiar campos 
function limpiarCampo(id) {
    const elementID = document.getElementById(id); // odtener campo del formulario
    elementID.value = ''; // limbiar dicho campo
}

//limpiar contenerdor html
function cleanHtml(id) {
    // Obtener el elemento padre
    const padre = document.getElementById(id);
    // Eliminar todos los hijos del elemento padre
    padre.innerHTML = "";
}

// notificacion de acciones para el usuario
function mostarToastify(texto, color) {
    Toastify({
        text: texto,
        duration: 2000,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
            background: `${color}`
        }
    }).showToast();
}

function hideOffcanvas(id) {
    var offcanvas = document.getElementById(id);
    offcanvas.classList.remove('show');
    // Obtén una referencia al elemento del residuo
    var residuoElemento = document.querySelector('.offcanvas-backdrop.fade.show');
    // Verifica si el elemento existe antes de intentar eliminarlo
    if (residuoElemento) {
        // Obtén el elemento padre del residuo
        var padreElemento = residuoElemento.parentNode;
        // Elimina el residuo del árbol del documento
        padreElemento.removeChild(residuoElemento);
    }

    // Obtén el elemento <body>
    var body = document.querySelector("body");

    // Elimina los estilos en línea del body
    body.style = "";
}

// funcion para salir de la seccion actual
function exitSession() {
    const btnExit = document.getElementById('exitSession');
    btnExit.addEventListener('click', SignOut);
}

//*insert option a un select
function insertOptions(selectId, options) {
    // Get the select element by ID
    const select = document.getElementById(selectId);

    // Loop through the options array using forEach
    options.forEach(option => {
        // Create a new option element
        const newOption = document.createElement("option");

        // Set the value and text of the option element
        newOption.value = option.id;
        newOption.text = option.nombre;

        // Add the option element to the select element
        select.appendChild(newOption);
    });
}

//funcion insertar texto
function insertText(id, texto) {
    // Obtener el elemento padre
    const element = document.getElementById(id);
    // Eliminar todos los hijos del elemento padre
    element.textContent = texto;
}

function insertValueText(id, texto) {
    // Obtener el elemento padre
    const element = document.getElementById(id);
    // Eliminar todos los hijos del elemento padre
    element.value = texto;
}

// !se exporta todo lo necesario aqui
export {
    changePageTitle,
    inyhtm,
    navbarCod,
    obtenerValor,
    limpiarCampo,
    cleanHtml,
    habDeshabiBoton,
    mostarToastify,
    tbodyCod,
    exitSession,
    insertText,
    insertValueText,
    tbodyCodVacio,
    codGruopKit,
    hideOffcanvas,
    insertOptions,
    itemKitCod,
    itemMinProduct
}