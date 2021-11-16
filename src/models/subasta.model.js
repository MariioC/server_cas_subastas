import mongoose, { Schema } from "mongoose";

const SubastaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    foto: {
        type: String,
    },
    descripcion: {
        type: String,
        required: true,
    },
    fecha_cancelacion: {
        type: Date,
        required: true,
    },
    fecha_inicio: {
        type: Date,
        required: true,
    },
    hora_inicio: {
        type: String,
        required: true,
    },
    fecha_fin: {
        type: Date,
        required: true,
    },
    hora_fin: {
        type: String,
        required: true,
    },
    monto_inicial: {
        type: Number,
        required: true,
    },
    online: {
        type: Boolean,
        default: false
    },
    finalizada: {
        type: Boolean,
        default: false,
    },
    documento_subastador: {
        type: Number,
        required: true
    }
});

const SubastaModel = mongoose.model("Subasta", SubastaSchema);

export default SubastaModel;
