import { Router } from "express"

import { verifyUserToken, IsInterno } from "../middleware/auth"
import { validatorSubasta } from "../middleware/validators/validatorSubasta"

// Controlldores
import { SubastasController } from "../controllers/subastas.controllers";
import { PujasController } from "../controllers/pujas.controllers";

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

subastasRoutes.post("/new", verifyUserToken, IsInterno, validatorSubasta, async (req, res) => {
    const { nombre, foto, descripcion, fecha_cancelacion, fecha_inicio, hora_inicio, fecha_fin, hora_fin, monto_inicial, online } = req.body

    const { data_token } = req

    try {
        const documento_subastador = data_token.documento

        const result = await SubastasController.createSubasta({
            nombre,
            foto,
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
