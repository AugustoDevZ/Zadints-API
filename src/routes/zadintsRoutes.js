import { Router } from "express";
import { ZadintsController } from "../controllers/zadintsController.js";

export const zadintsRouter = Router()

zadintsRouter.get('/', ZadintsController.getInfo)

zadintsRouter.post('/login', ZadintsController.userLogin)
zadintsRouter.post('/refresh', ZadintsController.userLogin)
zadintsRouter.post('/register', ZadintsController.userRegister)
zadintsRouter.get('/logout', ZadintsController.userLogout)

zadintsRouter.get('/me', ZadintsController.getMe)

zadintsRouter.get('/protected', ZadintsController.getInfo)