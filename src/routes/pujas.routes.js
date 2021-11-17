import { Router } from 'express'

// Validators
import { verifyUserToken } from '../middleware/auth'
import { validatorPuja } from '../middleware/validators/validatorPuja';

// Controllers
import { SubastasController } from '../controllers/subastas.controllers';
import { PujasController } from '../controllers/pujas.controllers';

import { prettierValorCOP, prettierFecha } from '../helpers/utils'

export const pujasRoutes = Router()

pujasRoutes.get('/:id_subasta', verifyUserToken, async (req, res) => {
    const { id_subasta } = req.params
    try {
        const pujas = await PujasController.getPujasBySubasta(id_subasta)
        res.json({
            message: 'Hola desde el ENDPOINT pujas',
            pujas,
        })
    } catch (error) {
        console.log(error)
        res.json({
            error: 'Ha ocurrido un error inesperado al crear la subasta',
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

        console.log(fecha_puja);
        
        // Valido si existe la subasta
        const subasta = await SubastasController.getSubastaById(id_subasta)
        if(!subasta) {
            return res.json({
                error: 'No se ha realizado la puja, debido a que la subasta no existe o fue eliminada'
            })
        }

        // Valido si la puja esta siendo enviada dentro de las fechas de inicio y fin de la subasta
        if(Date.parse(fecha_puja) < Date.parse(subasta.fecha_inicio)) {
            const fecha_inicio = new Date(subasta.fecha_inicio).toISOString().split('T')[0]
            return res.json({
                error: `Aún no puede realizar pujas. \n\nEsta subasta dará inicio el ${prettierFecha(fecha_inicio)} a las ${subasta.hora_inicio}`
            })
        }

        if(Date.parse(fecha_puja) > Date.parse(subasta.fecha_fin)) {
            const fecha_fin = new Date(subasta.fecha_inicio).toISOString().split('T')[0]
            return res.json({
                error: `Ya no puede realizar pujas en esta subasta.\n\nEsta subasta finalizó el ${prettierFecha(fecha_fin)} a las ${subasta.hora_fin}`
            })
        }

        // Obtengo la puja mas alta de la subasta, y valido que el valor de la nueva puja, supere dicha puja
        const maxPuja = await PujasController.getMaxPujaBySubasta(id_subasta)
        if(maxPuja && maxPuja.valor >= valor) {
            return res.json({
                error: `La subasta ya tiene una puja por un valor mayor o igual al enviado\n\nValor actual de la mejor puja: ${prettierValorCOP(maxPuja.valor)}`
            })
        }

        const documento_pujador = data_token.documento
        const nombre_pujador = data_token.nombre
        
        const puja = await PujasController.createPuja({ valor, fecha_puja, nombre_pujador, documento_pujador, id_subasta })

        res.json({
            message: 'Puja realizada correctamente',
            puja
        })

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Ha ocurrido un error inesperado al realizar la puja',
        })
    }
});

pujasRoutes.delete('/:id_puja', verifyUserToken, async (req, res) => {
    const { id_puja } = req.params

    const { data_token } = req

    try {

        const puja = await PujasController.getPujaById(id_puja)
        if(!puja) {
            return res.json({
                error: 'La puja que desea cancelar ya no existe'
            })
        }

        if(puja.documento_pujador != data_token.documento) {
            return res.json({
                error: 'No es posible cancelar la puja'
            })
        }

        // Una vez tenga la fecha de la puja, le rersto el tiempo del timeZone para el cso de colombia serian 5 horas
        const subasta = await SubastasController.getSubastaById(puja.id_subasta)

        if(!subasta) {
            // Elimino la puja
            await puja.remove()
            return res.json({
                message: 'Se ha cancelado la puja correctamente'
            })
        }

        let fecha_cancelacion = new Date()
        fecha_cancelacion = new Date( fecha_cancelacion.getTime() - fecha_cancelacion.getTimezoneOffset() * 60000)

        if(Date.parse(fecha_cancelacion) > Date.parse(subasta.fecha_fin)) {
            return res.json({
                error: `La subasta finalizó, ya no es posible cancelar la puja`
            })
        }

        // Elimino la puja
        await puja.remove()

        // TODO: Una vez se cancele la puja, se le debe notificar al usuario que realizo la puja anterior que su puja es la ganadora hasta el momento

        res.json({
            message: 'Se ha cancelado la puja correctamente'
        })

    } catch (error) {
        console.log(error)
        res.json({
            error: 'Ha ocurrido un error inesperado al cancelar la puja',
        })
    }
});
