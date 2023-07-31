import { app } from "./firebase-client.js";
import { getFirestore, collection, addDoc, getDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { cleanHtml, habDeshabiBoton, hideOffcanvas, mostarToastify } from "../function.js";
import { colors } from "../enum.js";
import { limpiarForm, productosTabla, productoID, offCanvasMod, gruopListKits, calculoCantProx, listItemMinProduct } from "../page/Almacen.js";
// Obtén una instancia de Cloud Firestore
const db = getFirestore(app);
var productos = [];
var productosMinimo = [];
let kits = [];

// Función para agregar un producto a la colección "Almacen"
async function agregarProducto(nombre, marca, cantidad, cantidad_min, precio_compra, unidad_compra, inf_und_compra, precio_venta, unidad_venta, inf_und_venta) {
    try {

        const docRef = await addDoc(collection(db, 'Almacen'), {
            nombre: nombre,
            marca: marca,
            cant: cantidad,
            cant_min: cantidad_min,
            precio_compra: precio_compra,
            unidad_compra: unidad_compra,
            inf_und_compra: inf_und_compra,
            precio_venta: precio_venta,
            unidad_venta: unidad_venta,
            inf_und_venta: inf_und_venta
        });

        limpiarForm() // limpiaza de los campos de los formularios
        habDeshabiBoton("btnAgregar"); // habilito el btn para agregar mas productos
    } catch (error) {
        console.error('Error al agregar el producto: ', error);
    }
}

async function agregarKit(nombre, precio, diccionarios) {
    try {
        const almacenRef = collection(db, "Kits");

        await addDoc(almacenRef, {
            nombre: nombre,
            precio: precio,
            itemKit: diccionarios
        });

        mostarToastify("Kit listo para usar", colors.CORRECT);
    } catch (error) {
        console.error('Error al agregar el kit: ', error);
    }
}


async function actualizaciones() {
    const consulta = query(collection(db, 'Almacen'), orderBy("nombre"));

    const unsubscribe = onSnapshot(consulta, (snapshot) => {
        productos.splice(0, productos.length);
        productosMinimo.splice(0, productosMinimo.length);

        if (productoID != null) {
            snapshot.docChanges().forEach((change) => {
                var producto = change.doc.data();
                if (change.type === 'modified') {
                    if (change.doc.id === productoID) {
                        offCanvasMod(productoID, producto.nombre, producto.marca, producto.cant, producto.cant_min, producto.precio_compra, producto.unidad_compra, producto.inf_und_compra, producto.precio_venta, producto.unidad_venta, producto.inf_und_venta);
                    }
                }
            })
        }

        snapshot.forEach((doc) => {
            const producto = {
                id: doc.id,
                nombre: doc.data().nombre,
                marca: doc.data().marca,
                cant: doc.data().cant,
                cant_min: doc.data().cant_min,
                precio_venta: doc.data().precio_venta,
                unidad_venta: doc.data().unidad_venta,
                inf_und_venta: doc.data().inf_und_venta,
                precio_compra: doc.data().precio_compra,
                unidad_compra: doc.data().unidad_compra,
                inf_und_compra: doc.data().inf_und_compra
            };

            //verificamos si los productos estan en el minimo para que se agreguen al arrays normal mas al arrays minProductos
            if (producto.cant <= producto.cant_min) {
                productos.push(producto)
                productosMinimo.push(producto)
            } else {
                productos.push(producto)
            };
        })

        cleanHtml('tbody');
        cleanHtml('gruopMinProduct');
        productosTabla(productos);
        listItemMinProduct(productosMinimo);
    })

    // Devolver función para cancelar la escucha
    return () => unsubscribe();
}

//!Actualizaciones de kits, soy conciente que no deveria abrir una escucha solo para esto
async function actualizadoKits() {
    const consulta = query(collection(db, 'Kits'), orderBy("nombre"));

    const unsubscribe = onSnapshot(consulta, (snapshot) => {
        kits.splice(0, kits.length);

        snapshot.forEach((doc) => {
            const kit = {
                id: doc.id,
                nombre: doc.data().nombre,
                precio: doc.data().precio,
                cantProx: 0,
                productos: doc.data().itemKit
            };

            kits.push(kit);
        })

        calculoCantProx();
        cleanHtml('itemListKits');
        gruopListKits(kits);
    })

    // Devolver función para cancelar la escucha
    return () => unsubscribe();
}

//Funcion para actualizar el producto
async function actualizarProducto(id, nombre, marca, cantidad, cantidad_min, precio_compra, unidad_compra, inf_und_compra, precio_venta, unidad_venta, inf_und_venta) {
    try {
        const docRef = doc(db, "Almacen", id);
        await updateDoc(docRef, {
            nombre: nombre,
            marca: marca,
            cant: cantidad,
            cant_min: cantidad_min,
            precio_compra: precio_compra,
            unidad_compra: unidad_compra,
            inf_und_compra: inf_und_compra,
            precio_venta: precio_venta,
            unidad_venta: unidad_venta,
            inf_und_venta: inf_und_venta
        })
        habDeshabiBoton("btnGuardarEdit");
        mostarToastify("Producto actualizado 😋", colors.CORRECT);
    } catch (error) {
        habDeshabiBoton("btnGuardarEdit");
        mostarToastify("Se presento un error al actualizar... 😰", colors.ERROR);
        console.error("Error al actualizar el documento:", error);
    }
}

/// funcion para eliminar productos de almacen
async function eliminarProducto(productId) {
    try {
        const productRef = doc(db, 'Almacen', productId);

        // Obtener el nombre del producto antes de eliminarlo
        const productSnapshot = await getDoc(productRef);
        const productName = productSnapshot.data().nombre;

        // !elimina el producto
        await deleteDoc(productRef);

        //demas acciones
        mostarToastify(`Producto eliminado correctamente: ${productName}`, colors.WARNING);
        hideOffcanvas('offcanvasfuntablaproduc');
    } catch (error) {
        console.error('Error al eliminar el producto: ', error);
    }
}


export {
    agregarProducto,
    eliminarProducto,
    actualizaciones,
    actualizadoKits,
    actualizarProducto,
    agregarKit,
    kits,
    productos,
    productosMinimo
}