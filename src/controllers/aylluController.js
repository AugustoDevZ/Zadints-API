import { AylluModel } from "../models/mysql/aylluDb.js";
import { AylluSchemas } from "../schemas/aylluSchema.js";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { SECRET_JWT_KEY } from "../../config.js";
export class AylluController {
    static async createItems(req, res) {
        const { user } = req.session //<- tiene el id del usuario y todo lo demás
        if (!user) return res.status(403).send('Access not authorized')

        const result = await AylluSchemas.createItem({ bodyContent: req.body })

        if (result.error) {
            res.status(400).json({ error: result.error })
            return
        }
        const id = await AylluModel.createItems({ input: result.data })
        res.status(200).json({ id: id })
    }

    static async getAllItem(req, res) {
        const result = await AylluModel.getItems()
        res.status(200).json({ result })
    }




}

