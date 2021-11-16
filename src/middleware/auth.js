import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyUserToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.json({ error: "Acceso denegado" });

    try {
        token = token.split(" ")[1];

        if (token === "null" || !token) return res.json({ error: "Solicitud no autorizada, debe iniciar sesión" });

        let dataToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!dataToken) return res.json({ error: "Token invalido, solicitud no autorizada" });

        req.data_token = dataToken;
        next();
    } catch (error) {
        res.json({ error: "Sesión inválida" });
    }
};

export const identifyUserToken = (req, res, next) => {
    let token = req.headers.authorization;
    let dataToken = null;

    req.data_token = dataToken;

    if (!token) return next();

    try {
        token = token.split(" ")[1];

        if (token === "null" || !token) return next();

        let dataToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!dataToken) return next();

        req.data_token = dataToken;
        next();
    } catch (error) {
        next();
    }
};

export const IsInterno = async (req, res, next) => {
    if (req.data_token?.tipo_usuario == "interno" || req.data_token?.tipo_usuario == "admin") {
        return next();
    }
    return res.json({ error: "No tiene permisos suficientes para realizar esta solicitud" });
};

export const IsAdmin = async (req, res, next) => {
    if (req.data_token?.tipo_usuario === "admin") {
        return next();
    }
    return res.json({ error: "No tiene permisos suficientes para realizar esta solicitud" });
};
