import { Router } from "express";
import { AugustoController } from "../controllers/augustoController.js";

export const augustoRouter = Router()

//--------------- para obtener todo referente a inventario---------------

augustoRouter.get('/sloganText', AugustoController.getSloganText)
augustoRouter.get('/countYearsExp', AugustoController.getSloganText)
augustoRouter.get('/proyectos', AugustoController.getSloganText)
augustoRouter.get('/experiencias', AugustoController.getSloganText)