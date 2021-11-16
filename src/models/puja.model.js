import mongoose, { Schema } from "mongoose";

const PujaSchema = new Schema({
    valor: {
        type: Number,
        required: true
    },
    fecha_puja: {
        type: Date,
        default: Date.now
    },
    ganadora: {
        type: Boolean,
        default: false,
    },
    nombre_pujador: {
        type: String,
        required: true
    },
    documento_pujador: {
        type: Number,
        required: true
    },
    id_subasta: {
        type: String,
        required: true
    }
});

const PujaModel = mongoose.model("Puja", PujaSchema);

export default PujaModel;
