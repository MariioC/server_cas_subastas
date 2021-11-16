import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log('\x1b[33m%s\x1b[0m', "  ⏳ - CONECTANDOSE A LA BASE DE DATOS...");
        await mongoose.connect("mongodb://localhost:27017/db_casa_subastas");
        console.log('\x1b[32m%s\x1b[0m', "  👍 - BASE DE DATOS CONECTADA");
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', "  ⛔ - ERROR AL CONECTAR CON LA BASE DE DATOS: ", error);
    }
};
