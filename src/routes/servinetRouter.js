import { Router } from "express";
import { ServinetController } from "../controllers/servinetController.js";
import { verifyTokenMovil } from "../middleware/verifyTokenMovil.js";

export const servinetRouter = Router()


servinetRouter.post('/auth', ServinetController.userMobileLogin)
servinetRouter.get('/auth', verifyTokenMovil, ServinetController.userCheckMobileSessionActive)
servinetRouter.post('/logout', verifyTokenMovil, ServinetController.userLogout)


servinetRouter.get('/orders', verifyTokenMovil, ServinetController.getAllOrders)
servinetRouter.post('/orders', verifyTokenMovil, ServinetController.getAllOrders) //hace rel order aqui
servinetRouter.get('/announce', verifyTokenMovil, ServinetController.getAnnounce)

servinetRouter.get('/@me/:uuid', verifyTokenMovil, ServinetController.getMeStats)
servinetRouter.get('/@me/:uuid/@open', ServinetController.getMeTecStats)


