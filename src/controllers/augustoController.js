import { AylluModel } from "../models/mysql/aylluDb.js";
import { AylluSchemas } from "../schemas/aylluSchema.js";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { SECRET_JWT_KEY } from "../../config.js";
export class AugustoController {
    static async getSloganText(req, res) {
        const result = await AylluModel.getItems()
        res.status(200).json({ result })
    }




}

