const opcInsert = Object.freeze({
    BEFORE_BEGIN: 'beforebegin',
    AFTER_BEGIN: 'afterbegin',
    BEFORE_END: 'beforeend',
    AFTER_END: 'afterend'
});

const colors = Object.freeze({
    WARNING: '#FC7A1E',
    ERROR: '#DB3A34',
    INF: '#04151F',
    CORRECT: '#1985A1'
})

const estados = Object.freeze({
    ESPERA:  "Espera",
    PROCESO: "Proceso",
    TERMINADO: "Terminado"
})

export {
    opcInsert,
    colors,
    estados
}