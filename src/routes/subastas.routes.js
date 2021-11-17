import { Router } from "express"

import { verifyUserToken, IsInterno } from "../middleware/auth"
import { validatorSubasta } from "../middleware/validators/validatorSubasta"

// Controlldores
import { SubastasController } from "../controllers/subastas.controllers";
import { PujasController } from "../controllers/pujas.controllers";

// Multer para la subida de archivos - imagenes
import path from 'path'
import fs from 'fs-extra'
import multer from 'multer';

import { randomString, uploadImg } from "../helpers/utils";


export const subastasRoutes = Router()

subastasRoutes.get("/", verifyUserToken, async (req, res) => {
    try {
        const subastas = await SubastasController.getSubastas()
        res.json({
            subastas
        })
    } catch (error) {
        console.log(error)
        res.json({
            error: "Ha ocurrido un error inesperado al obtener las subastas",
        })
    }
});

subastasRoutes.get("/:id_subasta", verifyUserToken, async (req, res) => {
    const { id_subasta } = req.params
    try {
        const subasta = await SubastasController.getSubastaById(id_subasta)
        const pujas = await PujasController.getPujasBySubasta(id_subasta)
        res.json({
            subasta,
            pujas
        })
    } catch (error) {
        console.log(error)
        res.json({
            error: "Ha ocurrido un error inesperado al consultar la subasta",
        })
    }
});

// TODO: volver a poner el validatorSubasta
subastasRoutes.post("/new", verifyUserToken, IsInterno, multer({ dest: path.join(__dirname, '../public/img/temp')}).single('foto'), async (req, res) => {

    // TODO: Quitar el JSON.parse(req.body.data) de aquí bajo
    const { nombre, foto, descripcion, fecha_cancelacion, fecha_inicio: f_inicio, hora_inicio, fecha_fin: f_fin, hora_fin, monto_inicial, online } = JSON.parse(req.body.data)

    const { data_token } = req

    try {

        // Proceso la imagen enviada por el usuario
        const imgUploded = await uploadImg(req.file);

        if(imgUploded.error) {
            return res.json({
                error: imgUploded.error
            })
        }

        // Configuro la fecha de inicio de la subasta correctamente
        const arrHHmmInicio = hora_inicio.split(':');
        const milisegundosHoraInicio = (+arrHHmmInicio[0]) * 60 * 60 + (+arrHHmmInicio[1]) * 60 
        
        let fecha_inicio = new Date(f_inicio);
        fecha_inicio = new Date(fecha_inicio.getTime() + milisegundosHoraInicio * 1000);

        // Configuro la fecha de finalizción de la subasta correctamente
        const arrHHmmFin = hora_fin.split(':');
        const milisegundosHoraFin = (+arrHHmmFin[0]) * 60 * 60 + (+arrHHmmFin[1]) * 60 

        let fecha_fin = new Date(f_fin);
        fecha_fin = new Date(fecha_fin.getTime() + milisegundosHoraFin * 1000);

        // minutes are worth 60 seconds. Hours are worth 60 minutes.

        const documento_subastador = data_token.documento

        const result = await SubastasController.createSubasta({
            nombre,
            foto: imgUploded.fileName,
            descripcion,    
            fecha_cancelacion,
            fecha_inicio,
            hora_inicio,
            fecha_fin,
            hora_fin,
            monto_inicial,
            online,
            documento_subastador
        })

        const subasta = result.toJSON();
        delete subasta.__v;
        res.json({
            message: 'Subasta creada correctamente',
            subasta
        })

    } catch (error) {
        console.log(error)
        res.json({
            error: "Ha ocurrido un error inesperado al crear la subasta",
        })
    }
});
