import mongoose, { Schema } from "mongoose";

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
    },
    tipo_documento: {
        type: String,
        required: true,
    },
    documento: {
        type: Number,
        required: true,
    },
    fecha_nacimiento: {
        type: Date,
        required: true,
    },
    expedicion_documento: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tipo_usuario: {
        type: String,
        required: true,
        enum: ["interno", "externo", "admin"],
        default: "externo",
    },
    fecha_registro: {
        type: Date,
        default: Date.now,
    },
    verificado: {
        type: Boolean,
        default: false,
    },
});

const UsuarioModel = mongoose.model("Usuario", UsuarioSchema);

export default UsuarioModel;
