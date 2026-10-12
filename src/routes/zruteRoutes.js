import { Router } from "express";
import { ZruteController } from '../controllers/zruteController.js'
import { verifyToken } from '../middleware/verifyToken.js';

export const zruteRouter = Router()

/*
//access methods
zruteRouter.post('/login', ZruteController.postLoginUserZrute)

zruteRouter.post('/register', ZruteController.postCreateUserZrute)

zruteRouter.get('/user/me', verifyToken, ZruteController.getProfileZrute)

zruteRouter.post('/user/routes', verifyToken, ZruteController.postViableRute)

zruteRouter.get('/account/', verifyToken, ZruteController.getProfileZrute)
//generic not auth methods



//special bus rute trujillo json
zruteRouter.get('/rute/:id', ZruteController.getAllZrute)
//buscar la ruta de bus màs cercana que pasa por èl
zruteRouter.post('/rute/calculate', ZruteController.getAllZrute)



//app info all
zruteRouter.get('/app/reviews', ZruteController.getProfileZrute)

zruteRouter.get('/app/creators', ZruteController.getProfileZrute)

zruteRouter.get('/app/info', ZruteController.getProfileZrute)


*/