export const prettierValorCOP = (valor) => {
    const formater = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    })

    return formater.format(valor)
}

export const prettierFecha = (fecha) => {
    const date = new Date(fecha);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    return date.toLocaleDateString("es-ES", options)
}