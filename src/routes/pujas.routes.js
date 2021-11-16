import { Router } from 'express'
import jwt from 'jsonwebtoken'

import { config } from 'dotenv'
config();

import PujaModel from '../models/puja.model'
import SubastaModel from '../models/subasta.model'

import { verifyUserToken, IsInterno } from '../middleware/auth'
import { validatorPuja } from '../middleware/validators/validatorPuja';

export const pujasRoutes = Router()

pujasRoutes.get('/', verifyUserToken, async (req, res) => {
    try {
        const pujas = await PujaModel.find()
        res.json({
            message: 'Hola desde el ENDPOINT pujas',
            pujas,
        })
    } catch (error) {
        console.log(error)
        res.json({
            error: 'Ha ocurrido un error inesperado al crear la subasta. Inténtelo más tarde',
        })
    }
});

pujasRoutes.post('/new/:id_subasta', verifyUserToken, validatorPuja, async (req, res) => {
    let { valor, fecha_puja } = req.body
    const { id_subasta } = req.params

    const { data_token } = req

    try {

        fecha_puja = fecha_puja ? new Date(fecha_puja) : new Date()

        // Una vez tenga la fecha de la puja, le rersto el tiempo del timeZone para el cso de colombia serian 5 horas
        fecha_puja = new Date( fecha_puja.getTime() - fecha_puja.getTimezoneOffset() * 60000)

        // Obtengo la fecha en formato (YYYY-mm-dd) de la puja
        const date_puja = fecha_puja.toISOString().split('T')[0]
        // Obtengo la hora en formato (HH:mm) de la puja
        const hora_puja = fecha_puja.toISOString().split('T')[1].substring(0, 5)
        
        // Valido si existe la subasta
        const subasta = await SubastaModel.findById(id_subasta)
        if(!subasta) {
            return res.json({
                error: 'No se ha realizado la puja, debido a que la subasta no existe o fue eliminada'
            })
        }

        // Valido si la puja esta siendo enviada dentro de las fechas de inicio y fin de la subasta
        if(Date.parse(date_puja) < Date.parse(subasta.fecha_inicio)) {
            const fecha_inicio = new Date(subasta.fecha_inicio).toISOString().split('T')[0]
            return res.json({
                error: `Esta subasta dará inicio el ${fecha_inicio} a las ${subasta.hora_inicio}`
            })
        }

        if(Date.parse(`01/01/2011 ${hora_puja}`) < Date.parse(`01/01/2011 ${subasta.hora_inicio}`)) {
            return res.json({
                error: `Aún no puede realizar pujas en esta subasta.\n\nLa subasta dará inicio a las ${subasta.hora_inicio}`
            })
        }

        if(Date.parse(date_puja) > Date.parse(subasta.fecha_fin)) {
            const fecha_fin = new Date(subasta.fecha_inicio).toISOString().split('T')[0]
            return res.json({
                error: `Esta subasta ha finalizado el ${fecha_fin} a las ${subasta.hora_fin}`
            })
        }

        if(Date.parse(date_puja) == Date.parse(subasta.fecha_fin) && Date.parse(`01/01/2011 ${hora_puja}`) > Date.parse(`01/01/2011 ${subasta.hora_fin}`)) {
            return res.json({
                error: `Ya no puede realizar pujas en esta subasta.\n\nLa subasta ha finalizado a las ${subasta.hora_fin}`
            })
        }

        const documento_pujador = data_token.documento

        const puja = new PujaModel({
            valor,
            fecha_puja,
            documento_pujador,
            id_subasta
        })

       await puja.save()

        res.json({
            message: 'Puja realizada correctamente',
            puja
        })

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Ha ocurrido un error inesperado al realizar la puja. Inténtelo más tarde',
        })
    }
});
