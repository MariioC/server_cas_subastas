import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";

// Importación del archivo socket.js para configurar el socket
import Socket from "./socket";

// Variables de entorno
import { config } from "dotenv";
config();

// Importación para la conexión a la base de datos
import { connectDB } from "./database";

// Importación del las rutas para el API
import { apiRoutes } from "./routes/index";

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Creación de la APP
const app = express();

// Creación del servidor
const server = createServer(app);

// USO MIDDLEWARES
app.use(cors());
app.use(morgan("dev"));
app.use(compression());
app.use(urlencoded({ extended: false }));
app.use(json());

// RUTAS
app.use(express.static(__dirname + "/public"));
app.use("/api", apiRoutes);


// INICIAR EL SERVIDOR
server.listen(PORT, async () => {
    console.log('');
    console.log('\x1b[32m%s\x1b[0m', '---------------------------------------------------');

    console.log('\x1b[32m%s\x1b[0m', `  👂 - Sevidor iniciado en: http://localhost:${PORT}`);
    
    console.log('\x1b[32m%s\x1b[0m', '---------------------------------------------------');
    console.log('');

    // Conectar con la base de datos
    await connectDB();
});

// Inicializar el WebSocket
const socketIO = new Socket(server);
global.io = socketIO;
io.start();
