import { Router } from "express";
import jwt from "jsonwebtoken";

import { config } from "dotenv";
config();

import UsuarioModel from "../models/usuario.model";

import { hashPassword, verifyPassword } from "../helpers/authHelper";

import { UsuariosController } from "../controllers/usuarios.controllers";
import { validatorLogin, validatorUsuario } from "../middleware/validators/validatorUsuario";
import { identifyUserToken, verifyUserToken } from "../middleware/auth";

export const usuariosRoutes = Router();

usuariosRoutes.post("/registro", identifyUserToken, validatorUsuario, async (req, res) => {
    const { nombre, correo, tipo_documento, documento, fecha_nacimiento, expedicion_documento, password: pass = "" } = req.body;
    let { tipo_usuario = "externo" } = req.body;

    const { data_token } = req;

    try {
        if (await UsuariosController.getUsuarioByDocumento(documento)) {
            return res.json({
                error: "El número de documento ya se encuentra registrado en la plataforma",
            });
        }

        if (await UsuarioModel.findOne({ correo })) {
            return res.json({
                error: "El correo ingresado ya se encuentra registrado en la plataforma",
            });
        }

        const password = await hashPassword(pass);

        if (data_token?.tipo_usuario != "admin") {
            tipo_usuario = "externo";
        }

        const result = await UsuariosController.createUsuario({ nombre, correo, tipo_documento, documento, fecha_nacimiento, expedicion_documento, password, tipo_usuario });

        const usuario = result.toJSON();
        delete usuario.password;
        delete usuario.__v;

        const token = jwt.sign({ id: usuario._id, documento, tipo_usuario }, process.env.SECRET_KEY);

        res.json({
            message: "Usuario registrado de manera correcta",
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.json({
            error: "Ha ocurrido un error inesperado en el registro. Inténtelo más tarde",
        });
    }
});

usuariosRoutes.post("/login", validatorLogin, async (req, res) => {
    const { documento, password } = req.body;
    try {
        const result = await UsuarioModel.findOne({ documento });

        if (!result) {
            return res.json({
                error: "El usuario no se encuentra registrado en la plataforma",
            });
        }

        const usuario = result.toJSON();

        if (!(await verifyPassword(password, usuario.password))) {
            return res.json({
                error: "Contraseña incorrecta",
            });
        }

        delete usuario.password;
        delete usuario.__v;

        const token = jwt.sign({ id: usuario._id, documento: usuario.documento, tipo_usuario: usuario.tipo_usuario || "externo" }, process.env.SECRET_KEY);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.json({
            error: "Ha ocurrido un error inesperado al iniciar sesión. Inténtelo más tarde",
        });
    }
});

usuariosRoutes.get("/", async (req, res) => {
    const usuarios = await UsuarioModel.find();
    res.json({
        message: "Hola desde el ENDPOINT usuarios",
        usuarios,
    });
});

usuariosRoutes.get("/:documento", async (req, res) => {
    const { documento } = req.params;
    const usuario = await UsuariosController.getUsuarioByDocumento(documento);

    res.json({
        message: "Se muestra la información del usuario deseado",
        usuario,
    });
});
