import { ZadintsDatabase } from "../models/mysql/zadints.js";
import { AuthSchemas } from "../schemas/authSchema.js";
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { uuidv7 } from "zod";
import { zadintsRouter } from "../routes/zadintsRoutes.js";
import { CreateTokens } from "../services/authServices.js";
export class ZadintsController {
    static async getInfo(req, res) {
        res
            .json('Hello word');
    }


    static async getMe(req, res) {
        const { user } = req.session //<- tiene el id del usuario y todo lo demás
        if (!user) return res.status(403).send('Access not authorized')

        const info = await ZadintsDatabase.getInfoMe({ userSession: req.session.user.userinfo.user_id })

        res.status(200).json(info)
    }
    static async userLogout(req, res) {

        res
            .clearCookie('access_token')
            .status(200)
            .json('logou success');
    }
    static async userLogin(req, res) {
        try {
            const result = await AuthSchemas.login({ bodyContent: req.body });
            if (result.error) return res.status(400).json(result);
            const userinfo = await ZadintsDatabase.loginUser({ userObject: result.data });
            if (!userinfo) return res.status(401).json("Usuario o contraseña incorrectos");


            const accessTokenId = uuidv7();
            const refreshTokenId = uuidv7();
            const sessionId = uuidv7();
            const userId = userinfo.user_id;

            const jwtData = {
                userId,
                sessionId,
                accessTokenId,
                refreshTokenId,
            }
            const { accessToken, refreshToken } = await CreateTokens(jwtData)

            const userAgent = req.headers["user-agent"];
            const userIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress; //app.set("trust proxy", true); const ip = req.ip;
            const dataDecoded = jwt.decode(refreshToken);

            const sessionRevocable = {
                sessionId,
                userId,
                accessTokenId,
                refreshTokenId,
                userAgent,
                userIp,
                dataDecoded
            }
            //arreglar aqui que verifique que no se cruze si ya tiene una sesión habilitada.
            const status = await ZadintsDatabase.saveSession({ userObject: sessionRevocable })
            const additionalInfoUser = await ZadintsDatabase.getUserCosmetic({ userId: userId });


            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60
            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/auth/refresh",
                maxAge: 1000 * 60 * 60 * 24 * 7
            });

            return res.status(200).json({ user: userinfo, additional: additionalInfoUser });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }
    static async userRegister(req, res) {
        const result = await AuthSchemas.register({ bodyContent: req.body })

        if (result.error) {
            res.status(400).json(result.error.flatten().fieldErrors)
        }
        //armar model de los datos a registrar en la db
        const { handle, displayName, password, email, avatar } = result.data
        const userId = uuidv7();

        const basicUserData = {
            userId,
            handle,
            displayName,
            password,
            email
        };
        await ZadintsDatabase.AddUser(basicUserData);
        await ZadintsDatabase.AddUserCosmetic(userId, avatar)

        const accessTokenId = uuidv7();
        const refreshTokenId = uuidv7();
        const sessionId = uuidv7();
        const jwtData = {
            userId,
            sessionId,
            accessTokenId,
            refreshTokenId,
        }
        const { accessToken, refreshToken } = await CreateTokens(jwtData)

        const userAgent = req.headers["user-agent"];
        const userIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress; //app.set("trust proxy", true); const ip = req.ip;
        const dataDecoded = jwt.decode(refreshToken);

        const sessionRevocable = {
            sessionId,
            userId,
            accessTokenId,
            refreshTokenId,
            userAgent,
            userIp,
            dataDecoded
        }
        //arreglar aqui que verifique que no se cruze si ya tiene una sesión habilitada.
        const status = await ZadintsDatabase.saveSession({ userObject: sessionRevocable })
        const additionalInfoUser = await ZadintsDatabase.getUserCosmetic({ userId: userId });


        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/auth/refresh",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.status(200).json({ user: basicUserData, additional: additionalInfoUser });
    }
}