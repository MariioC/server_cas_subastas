import UsuarioModel from "../models/usuario.model";

export const UsuariosController = {
    async getUsuarioByDocumento(documento) {
        try {
            return await UsuarioModel.findOne({ documento });
        } catch (error) {
            console.log(error);
            return null;
        }
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
        });

        return await usuario.save();
    },
};
