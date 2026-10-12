import { Router } from "express";
import { AylluController } from "../controllers/aylluController.js";

export const aylluRouter = Router()

//--------------- para obtener todo referente a inventario---------------
//Crear item
aylluRouter.post('/inventory', AylluController.createItems)
//obtener items all
aylluRouter.get('/inventory', AylluController.getAllItem)


// actualizar o eliminar o obtener info
aylluRouter.patch('/inventory/:id', AylluController.getAllItem)
aylluRouter.delete('/inventory/:id', AylluController.getAllItem)
aylluRouter.get('/inventory/:id', AylluController.getAllItem)


// a vencer y vencidos
aylluRouter.get('/inventory/expiring', AylluController.getAllItem)
aylluRouter.get('/inventory/expired', AylluController.getAllItem)
aylluRouter.get('/inventory/new', AylluController.getAllItem)


// obtener todas cat
aylluRouter.get('/inventory/categories', AylluController.getAllItem)
//obtener info de cat o editar
aylluRouter.get('/inventory/categories/:id', AylluController.getAllItem)
aylluRouter.patch('/inventory/categories/:id', AylluController.getAllItem)
aylluRouter.delete('/inventory/categories/:id', AylluController.getAllItem)


//--------------- para manejar mijin el asunto de---------------

//toda info del negocio o una parte o editar
aylluRouter.get('/business/info', AylluController.getAllItem)
aylluRouter.get('/business/info/:section', AylluController.getAllItem)
aylluRouter.patch('/business/info', AylluController.getAllItem)
//crear bussines o eliminar
aylluRouter.post('/business', AylluController.getAllItem)
aylluRouter.delete('/business', AylluController.getAllItem)
//todo sobre las estadísticas del negocio
aylluRouter.get('/business/stats', AylluController.getAllItem)
//una estadística en específico
aylluRouter.get('/business/stats/:metric', AylluController.getAllItem)