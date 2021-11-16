import { Router } from 'express'
import { usuariosRoutes } from './usuarios.routes';
import { subastasRoutes } from './subastas.routes';
import { pujasRoutes } from './pujas.routes';

export const apiRoutes = Router();

apiRoutes.use('/usuarios', usuariosRoutes);
apiRoutes.use('/subastas', subastasRoutes);
apiRoutes.use('/pujas', pujasRoutes);