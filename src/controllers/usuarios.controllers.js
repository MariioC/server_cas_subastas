import UsuarioModel from '../models/usuario.model';

export const UsuariosController = {
    async getUsuarioByDocumento(documento) {
        return await UsuarioModel.findOne({ documento })
    },

    async getUsuarioByCorreo(correo) {
        return await UsuarioModel.findOne({ correo })
    },
    
    async createUsuario({ nombre, correo, tipo_documento, documento, fecha_nacimiento, expedicion_documento, password, tipo_usuario }) {
        const usuario = new UsuarioModel({
            nombre,
            correo,
            tipo_documento,
            documento,
            fecha_nacimiento,
            expedicion_documento,
            password,
            tipo_usuario
        })

        return await usuario.save()
    },
};
