import { Router } from "express"
import jwt from "jsonwebtoken"

import { config } from "dotenv"
config();

import SubastaModel from "../models/subasta.model"

import { verifyUserToken, IsInterno } from "../middleware/auth"
import { validatorSubasta } from "../middleware/validators/validatorSubasta"

export const subastasRoutes = Router()

subastasRoutes.get("/", verifyUserToken, async (req, res) => {
    try {
        const subastas = await SubastaModel.find()
        res.json({
            message: "Hola desde el ENDPOINT subastas",
            subastas,
        })
    } catch (error) {
        console.log(error)
        res.json({
            error: "Ha ocurrido un error inesperado al crear la subasta. Inténtelo más tarde",
        })
    }
});

subastasRoutes.post("/new", verifyUserToken, IsInterno, validatorSubasta, async (req, res) => {
    const { nombre, foto, descripcion, fecha_cancelacion, fecha_inicio, hora_inicio, fecha_fin, hora_fin, monto_inicial, online } = req.body

    const { data_token } = req

    try {
        console.log(data_token)
        const documento_subastador = data_token.documento
        const subasta = new SubastaModel({
            nombre, foto, descripcion, fecha_cancelacion, fecha_inicio, hora_inicio, fecha_fin, hora_fin, monto_inicial, online, documento_subastador
        })

       await subasta.save()

        res.json({
            message: 'Subasta creada correectamente'
        })

    } catch (error) {
        console.log(error)
        res.json({
            error: "Ha ocurrido un error inesperado al crear la subasta. Inténtelo más tarde",
        })
    }
});
