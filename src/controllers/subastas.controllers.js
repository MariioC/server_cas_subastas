import SubastaModel from "../models/subasta.model";

export const SubastasController = {
    async getSubastas() {
        return await SubastaModel.find()
    },

    async getSubastaById(id_subasta) {
        return await SubastaModel.findById(id_subasta)
    },

    async createSubasta({ nombre, foto, descripcion, fecha_cancelacion, fecha_inicio, hora_inicio, fecha_fin, hora_fin, monto_inicial, online, documento_subastador }) {
        const subasta = new SubastaModel({
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

        return await subasta.save()
    },
};
