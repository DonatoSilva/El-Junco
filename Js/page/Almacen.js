import { colors, opcInsert } from "../enum.js";
import { changePageTitle, navbarCod, inyhtm, limpiarCampo, habDeshabiBoton, mostarToastify, exitSession, tbodyCod, insertText, cleanHtml, tbodyCodVacio, codGruopKit, insertValueText, insertOptions, itemKitCod, itemMinProduct } from "../function.js";
import { actualizaciones, actualizarProducto, agregarProducto, eliminarProducto, productos as arrayProductos, agregarKit, actualizadoKits, kits } from "../Data/firebase-firestore-almacen.js";

// cambiar titulo de la pestaña
changePageTitle("El Junco | ALMACEN")
let productoID;
let productoNombre;
let productoMarca;
let productoCantActual;
let productoCantMin;
let productoPrecCompra;
let productoUndCompra;
let productoInfUndCompra;
let productoPrecVenta;
let productoUndVenta;
let productoInfUndVenta;

//Arrys con los id necesarios para el evento de cambio en el contenido del input
const inputEditId = ["nameEditForm", "marcaEditForm", "CantEditForm", "Cant-minEditForm", "Precio-compraEditForm", "Unidad-compraEditForm", "infUndCompraEditForm", "Precio-ventaEditForm", "Unidad-ventaEditForm", "infUndVentaEditForm"];

//variable que controla el add event de un boton
let statusEvent = false;

actualizaciones();
actualizadoKits();

inyhtm('navbar', opcInsert.BEFORE_END, navbarCod(''));

// codigo para el formulario
const formulario = document.getElementById('formulario');  //  Obtiene una referencia al formulario

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('name').value;
    const marca = document.getElementById('marca').value;
    const cantidad = parseInt(document.getElementById('Cant').value, 10);
    const cantidadMinima = parseInt(document.getElementById('Cant-min').value, 10);
    const precioCompra = parseInt(document.getElementById('Precio-compra').value, 10);
    const unidadCompra = document.getElementById('Unidad-compra').value;
    const infUndCompra = document.getElementById('infUndCompra').value;
    const precioVenta = parseInt(document.getElementById('Precio-venta').value, 10);
    const unidadVenta = document.getElementById('Unidad-venta').value;
    const infUndVenta = document.getElementById('infUndVenta').value;

    if (nombre.trim() === '' || marca.trim() === '' || isNaN(cantidad) || isNaN(cantidadMinima) || isNaN(precioCompra) || unidadCompra === "" || infUndCompra.trim() === "" || isNaN(precioVenta)
        || unidadVenta === "" || infUndVenta.trim() === "") {
        mostarToastify("😰 Complete los campos para continuar", colors.WARNING);
        return false;
    }

    habDeshabiBoton("btnAgregar", true); // inabilito el btn para asi evitar que se agrege dos veces el mismo producto
    agregarProducto(nombre.trim(), marca.trim(), cantidad, cantidadMinima, precioCompra, unidadCompra, infUndCompra, precioVenta, unidadVenta, infUndVenta);
    mostarToastify("😌 Producto agregado", colors.CORRECT)
    return true;
});

function listItemMinProduct(listItemArrys) {
    insertText("longitudMinProduct", listItemArrys.length);
    if (listItemArrys.length === 0) {
        cleanHtml("gruopMinProduct");
        inyhtm('gruopMinProduct', opcInsert.BEFORE_END, tbodyCodVacio());
        habDeshabiBoton("listFullMinProduct", true)
    } else {
        const numeroMax = listItemArrys.length >= 5 ?  5 : listItemArrys.length;
        //el for no debe superar los 5 item por que no se va a mostrar todos los item
        habDeshabiBoton("listFullMinProduct")
        for (let i = 0; i < numeroMax; i++) {
            inyhtm("gruopMinProduct", opcInsert.BEFORE_END, itemMinProduct(listItemArrys[i].nombre, listItemArrys[i].cant_min, listItemArrys[i].cant))
        }

        const btnModificar = document.getElementsByClassName("btnFuncionMinProduct")
        for (let i = 0; i < numeroMax; i++) { 
            const producto = listItemArrys[i]
            const btn = btnModificar[i]

            btn.addEventListener("click", () => {
                mostarToastify("click", colors.INF)
                offCanvasMod(producto.id, producto.nombre, producto.marca, producto.cant, producto.cant_min, producto.precio_compra, producto.unidad_compra, producto.inf_und_compra, producto.precio_venta, producto.unidad_venta, producto.inf_und_venta);
                setTimeout(funcionEditProduct, 200); //
            })
        }
    }
}

function gruopListKits(kitsArrays) {
    insertText("longitudKits", kitsArrays.length)
    if (kitsArrays.length === 0) {
        cleanHtml('itemListKits');
        inyhtm('itemListKits', opcInsert.BEFORE_END, tbodyCodVacio());
        habDeshabiBoton("listFullKits", true)
    } else {
        const numeroMax = kitsArrays.length >= 5?  5 : kitsArrays.length;
        //el for no debe superar los 5 item por que no se va a mostrar todos los item
        habDeshabiBoton("listFullKits")
        for (let i = 0; i < 5; i++) {
            inyhtm("itemListKits", opcInsert.BEFORE_END, itemKitCod(kits[i].nombre, kits[i].cantProx, kits[i].precio))
        }
    }
}

function productosTabla(productos) {
    //condicional para poner el mensaje de vacio
    if (productos.length === 0) {
        cleanHtml('tbody');
        inyhtm('tbody', opcInsert.BEFORE_END, tbodyCodVacio());
    } else {
        /// funcion para insertar los productos en el almacen.html y darle el evento click a cada card{
        productos.forEach((producto, index) => {
            const tbody = tbodyCod(index + 1, producto.nombre, producto.marca, producto.cant, producto.precio_venta);
            inyhtm("tbody", opcInsert.BEFORE_END, tbody);
        });

        // Código para obtener información de la card al hacer clic
        const botonesModificar = document.getElementsByClassName('btnFuncion');
        const lengthArrys = botonesModificar.length;

        for (let e = 0; e < lengthArrys; e++) {
            const producto = productos[e];
            const btn = botonesModificar[e];

            btn.addEventListener('click', function () {
                offCanvasMod(producto.id, producto.nombre, producto.marca, producto.cant, producto.cant_min, producto.precio_compra, producto.unidad_compra, producto.inf_und_compra, producto.precio_venta, producto.unidad_venta, producto.inf_und_venta);
            });
        }
    }
}

// funcion encargada de pasar la informacion a el offCanvas
function offCanvasMod(id, nombre, marca, cantActual, cantMinima, precCompra, undCompra, infUndCompra, precVenta, undVenta, infUndVenta) {
    const unidades = ["", "Unidad", "Paquete", "Metros"];

    insertText('offNombre', nombre);
    insertText('offMarca', marca);
    insertText('offCantActual', cantActual);
    insertText('offCantMin', cantMinima);
    insertText('offPrecCompra', `$ ${precCompra}`);
    insertText('offUndPrecCompra', unidades[undCompra]);
    insertText('offInfUndCompra', infUndCompra);
    insertText('offPrecVenta', `$ ${precVenta}`);
    insertText('offUndPrecVenta', unidades[undVenta]);
    insertText('offInfUndVenta', infUndVenta);

    insertValueText('nameEditForm', nombre);
    insertValueText('marcaEditForm', marca);
    insertValueText('CantEditForm', cantActual);
    insertValueText('Cant-minEditForm', cantMinima);
    insertValueText('Precio-compraEditForm', precCompra);
    insertValueText('infUndCompraEditForm', infUndCompra);
    insertValueText('Precio-ventaEditForm', precVenta);
    insertValueText('infUndVentaEditForm', infUndVenta);
    // Obtener el elemento select por su id
    var UndCompra = document.getElementById("Unidad-compraEditForm");
    // Seleccionar el tercer elemento de la lista (índice 2)
    UndCompra.selectedIndex = undCompra;

    // Obtener el elemento select por su id
    var UndVenta = document.getElementById("Unidad-ventaEditForm");
    // Seleccionar el tercer elemento de la lista (índice 2)
    UndVenta.selectedIndex = undVenta;


    productoID = id;
    productoNombre = nombre;
    productoMarca = marca;
    productoCantActual = cantActual;
    productoCantMin = cantMinima;
    productoPrecCompra = precCompra;
    productoUndCompra = undCompra;
    productoInfUndCompra = infUndCompra;
    productoPrecVenta = precVenta;
    productoUndVenta = undVenta;
    productoInfUndVenta = infUndVenta;
}

//boton para limpiar el formulario de registro
const btnLimpiar = document.getElementById('btnLimpiar');
btnLimpiar.addEventListener('click', () => {
    limpiarForm();
    mostarToastify("Campos limpios", colors.INF);
});

const offBtnEliminar = document.getElementById('offBtnEliminar');
//eventos en los botones
offBtnEliminar.addEventListener('click', function () {
    eliminarProducto(productoID);
})

// *funcion que se llamara para agregar la accion de eliminar a su respectivo elemento de kit
const btnAddGruopKit = document.getElementById('addGroupKit');
var countGruopKit = 0; //variable que apoya al boton eliminar grupo de kit
btnAddGruopKit.addEventListener('click', () => {
    const textVacioGroup = document.getElementById('textVacioGroup');

    if (textVacioGroup) {
        cleanHtml('containerGroupKit');
    }

    countGruopKit++
    let [code, kitId] = codGruopKit(countGruopKit); //Se almacena lo que retorna la funcion para su respectivo uso
    inyhtm('containerGroupKit', opcInsert.BEFORE_END, code);
    QuitarGroupKit(`delete${kitId}`); //se llama la funcion que agrega el evento al respectivo boton de eliminar grupo de kit
    insertOptions(`select${kitId}`, arrayProductos);//inserta las opciones del select
})

//* obtener info al agregar kits
function obtInfAddKits() {
    var liKits = []
    const contenedor = document.querySelector('#containerGroupKit');//me ubico en el contenedor de los -
    const divSelectAsh = contenedor.querySelectorAll('.selecAsh');


    //recorremos lo obtendo en el divSelect..
    divSelectAsh.forEach((elements) => {
        const selectItem = elements.querySelector('select');
        const inputItem = elements.querySelector('input[type="number');

        const selectedOption = selectItem.options[selectItem.selectedIndex];
        const selectedText = selectedOption.text;

        var diccionarioSelect = {
            text: selectedText,
            id: selectItem.value,
            cant: inputItem.value
        }

        liKits.push(diccionarioSelect)
    })

    return liKits;
}

//boton add kits
const btnAddKit = document.querySelector('#btnAddkits');
btnAddKit.addEventListener('click', () => {
    agregarKit("Kit de repuesto", 55600, obtInfAddKits());
    limpiarAddKit();
})

//retira los elementos grump del kit form
function QuitarGroupKit(id) {
    // Obtener todos los botones con la clase "btnQuitarKit"
    const botonesQuitarKit = document.getElementById(id);

    botonesQuitarKit.addEventListener('click', function () {
        const elementoKit = botonesQuitarKit.parentNode; // Obtener el elemento padre del botón (div con la clase "input-group")
        elementoKit.remove(); // Eliminar el elemento correspondiente al botón del DOM

        countGruopKit = countGruopKit - 1;
        let [code, kitId] = codGruopKit(countGruopKit);
        if (countGruopKit == 0) {
            inyhtm('containerGroupKit', opcInsert.BEFORE_END, code);
        }
    });
}

//! limpiar formulari add kits
function limpiarAddKit() {  //<-- se encarga de limpiar el formulario de aggregar kit
    //ejecutar la funcion de limpiar los inputs
    limpiarCampo('precioKit');
    limpiarCampo('nombreKit');

    const limpiarContainer = () => {
        countGruopKit = 0;
        cleanHtml('containerGroupKit')
        let [code, kitId] = codGruopKit(countGruopKit);
        if (countGruopKit == 0) {
            inyhtm('containerGroupKit', opcInsert.BEFORE_END, code);
        }
    }

    limpiarContainer()
}

const btnLimpiarAddKit = document.getElementById('btnLimpiarAddKit');
btnLimpiarAddKit.addEventListener('click', () => {
    limpiarAddKit();
    mostarToastify("Campos limpios", colors.INF);
});

//*Editar Producto codigo y funciones necesaria
//Codigo para editar la info del producto
const btnActualizarProd = document.getElementById('offBtnActualizarProd');
btnActualizarProd.addEventListener('click', () => {
    funcionEditProduct();
});

const funcionEditProduct = () => { 
    if (form.style.display === "" || form.style.display === "none") {
        mostrarEditProd();
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
            mostrarDetallesProd();
            // Eliminar el evento de clic después de ejecutar la función
            document.removeEventListener("click", clicFuera);
        }
    }

    function mostrarEditProd() {
        habDeshabiBoton("btnGuardarEdit", true);
        form.style.display = "block";
        detProdcuto.style.display = "none";

        if (!statusEvent) {
            inputEditId.forEach((id, index) => {
                const inputElement = document.getElementById(id);
                inputElement.addEventListener('input', (event) => { changeInput(event, index) });
            });

            statusEvent = true;
        }
    }

    function mostrarDetallesProd() {
        form.style.display = "none";
        detProdcuto.style.display = "block";
    }
}

//función para verificar  
function changeInput(event, index) {
    const inputEditValue = [productoNombre, productoMarca, productoCantActual, productoCantMin, productoPrecCompra, productoUndCompra, productoInfUndCompra, productoPrecVenta, productoUndVenta, productoInfUndVenta];
    const nuevoValue = event.target.value;
    if (nuevoValue) {
        if (nuevoValue != inputEditValue[index]) {
            habDeshabiBoton("btnGuardarEdit");
        } else {
            habDeshabiBoton("btnGuardarEdit", true);
        }
    }
}

const form = document.getElementById("editProductoForm");
const detProdcuto = document.getElementById("detallesProducto");
//acciones para cancelar la edicion del paciente
const btnCancelarEdit = document.getElementById("btnCancelarEdit");
btnCancelarEdit.addEventListener("click", function () {

    if (detProdcuto.style.display === "none" || detProdcuto.style.display === "") {
        mostrarDetallesDueño();
    }

    ///funciones
    function mostrarDetallesDueño() {
        form.style.display = "none";
        detProdcuto.style.display = "block";
        //insertar texto a los input de EditForm
        insertDatosInputs
        // Obtener el elemento select por su id
        var UndCompra = document.getElementById("Unidad-compraEditForm");
        // Seleccionar el tercer elemento de la lista (índice 2)
        UndCompra.selectedIndex = productoUndCompra;

        // Obtener el elemento select por su id
        var UndVenta = document.getElementById("Unidad-ventaEditForm");
        // Seleccionar el tercer elemento de la lista (índice 2)
        UndVenta.selectedIndex = productoUndVenta;
    }
});

//!Boton actualizar producto
const btnGuardarEdit = document.getElementById("btnGuardarEdit");
btnGuardarEdit.addEventListener("click", (event) => {
    event.preventDefault();
    //obtener datos
    const nombre = document.getElementById('nameEditForm').value;
    const marca = document.getElementById('marcaEditForm').value;
    const cantidad = parseInt(document.getElementById('CantEditForm').value, 10);
    const cantidadMinima = parseInt(document.getElementById('Cant-minEditForm').value, 10);
    const precioCompra = parseInt(document.getElementById('Precio-compraEditForm').value, 10);
    const unidadCompra = document.getElementById('Unidad-compraEditForm').value;
    const infUndCompra = document.getElementById('infUndCompraEditForm').value;
    const precioVenta = parseInt(document.getElementById('Precio-ventaEditForm').value, 10);
    const unidadVenta = document.getElementById('Unidad-ventaEditForm').value;
    const infUndVenta = document.getElementById('infUndVentaEditForm').value;

    if (nombre.trim() === '' || marca.trim() === '' || isNaN(cantidad) || isNaN(cantidadMinima) || isNaN(precioCompra) || unidadCompra === "" || infUndCompra.trim() === "" || isNaN(precioVenta)
        || unidadVenta === "" || infUndVenta.trim() === "") {
        mostarToastify("😰 Complete los campos para continuar", colors.WARNING);
        return false;
    };

    //Llamar a la función actualizar() con los datos obtenidos
    actualizarProducto(
        productoID,
        nombre,
        marca,
        cantidad,
        cantidadMinima,
        precioCompra,
        unidadCompra,
        infUndCompra,
        precioVenta,
        unidadVenta,
        infUndVenta
    ).then(() => {
        form.style.display = "none";
        detProdcuto.style.display = "block";
    })

    return true
})

///accion para limpiar el formulario Edit
const btnLimpiarEdit = document.getElementById("btnLimpiarEdit");
btnLimpiarEdit.addEventListener('click', function () {
    //desabilitar el acturalizar
    habDeshabiBoton("btnGuardarEdit", true);
    //insertar texto a los input de EditForm
    insertDatosInputs()
    //mensaje orientador
    mostarToastify("Todo como antes 🤗", colors.INF)
})

function insertDatosInputs() {
    //insertar texto a los input de EditForm
    insertValueText('nameEditForm', productoNombre);
    insertValueText('marcaEditForm', productoMarca);
    insertValueText('CantEditForm', productoCantActual);
    insertValueText('Cant-minEditForm', productoCantMin);
    insertValueText('Precio-compraEditForm', productoPrecCompra);
    insertValueText('infUndCompraEditForm', productoInfUndCompra);
    insertValueText('Precio-ventaEditForm', productoPrecVenta);
    insertValueText('infUndVentaEditForm', productoInfUndVenta);
}
//*Fin del codigo para Editar Producto 

// funcion que sera llamada desde firebase-firestore para limpiar todos los campos solo si el producto se agrega correctamente
function limpiarForm() {
    limpiarCampo('name');
    limpiarCampo('marca');
    limpiarCampo('Cant');
    limpiarCampo('Cant-min');
    limpiarCampo('Precio-compra');
    limpiarCampo('Unidad-compra');
    limpiarCampo('infUndCompra');
    limpiarCampo('Precio-venta');
    limpiarCampo('Unidad-venta');
    limpiarCampo('infUndVenta');
};

//funcion que realiza una busqueda dentro de Productos respecto a un arrys de id y retorna un arrys nuevo con los que coinciden
function findProductoId(listado, grupoID) {
    const produtosFiltrados = listado.filter((produto) => grupoID.some((id) => id.id === produto.id));
    return produtosFiltrados
}

//*codigo que hace el calculo y retorna el aproximado minimo de kits que se podia tener
function calculoCantProx() {
    kits.length == 0 ? void 0 :
        kits.forEach((item) => {
                if (item.productos.length != 0) {
                    let minProxCant = 0;
                    const listProductos = findProductoId(arrayProductos, item.productos)
                    item.productos.forEach((p, index) => {
                        var valor = listProductos[index].cant / p.cant
                        minProxCant != 0 ? minProxCant = valor : minProxCant = valor;
                    })
                    item.cantProx = Math.round(minProxCant);
                }
            }
        );
}


function ceroScroll() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

///llamado a la funcion del click exitSession 
exitSession();

//scroll en posicion 0
ceroScroll();

export {
    limpiarForm,
    productosTabla,
    productoID,
    offCanvasMod,
    gruopListKits,
    calculoCantProx,
    listItemMinProduct
}