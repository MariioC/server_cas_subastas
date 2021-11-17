import path from 'path'
import fs from 'fs-extra'

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

export const randomString = () => {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < 15; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const uploadImg = async ( file ) => {
    const randomName = randomString();
    const imgTempPath = file.path;
    const extension = path.extname(file.originalname).toLowerCase();
    const targetPath = path.resolve(`src/public/img/${randomName}${extension}`);

    if(extension == '.png' || extension == '.jpg' || extension == '.jpeg' || extension == '.gif') {
        await fs.rename(imgTempPath, targetPath)
        return {
            fileName: `${randomName}${extension}`
        }
    } else {
        await fs.unlink(imgTempPath)
        return {
            error: 'Solo se aceptan imágenes en formato: |png|-|jpg|-|jpeg|-|gif|'
        }
    }
}