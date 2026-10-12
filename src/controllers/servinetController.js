import { ZadintsDatabase } from "../models/mysql/zadints.js";
import { AuthSchemas } from "../schemas/authSchema.js";
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import { v7 as uuidv7 } from 'uuid';
import { zadintsRouter } from "../routes/zadintsRoutes.js";
import { CreateTokens } from "../services/authServices.js";
import { ServinetDatabase } from "../models/sqlserver/servinet.js";

const rateLimitMap = new Map();
const MAX_REQUESTS = 10;
const WINDOW_TIME = 60 * 1000;

export class ServinetController {


    static async getInfo(req, res) {
        res
            .json('Hello word');
    }


    static async getAnnounce(req, res) {

        const { user } = req.session;

        if (!user) {
            return res.status(401).json({
                error: 'Access not authorized'
            });
        }

        const announces = await ServinetDatabase.getAnnounces();

        return res.status(200).json(announces);
    }

    static async getAllOrders(req, res) {

        const { user } = req.session;

        if (!user) {
            return res.status(401).json({
                error: 'Access not authorized'
            });
        }

        const announces = await ServinetDatabase.getAllOders();
        console.log(announces);
        return res.status(200).json(announces);
    }


    static async getMeTecStats(req, res) {
        try {
            const userIp =
                req.headers["x-forwarded-for"]?.split(",")[0] ||
                req.socket.remoteAddress;

            const currentTime = Date.now();

            if (!rateLimitMap.has(userIp)) {
                // Primera petición de esta IP
                rateLimitMap.set(userIp, { count: 1, resetTime: currentTime + WINDOW_TIME });
            } else {
                const ipData = rateLimitMap.get(userIp);

                if (currentTime > ipData.resetTime) {
                    ipData.count = 1;
                    ipData.resetTime = currentTime + WINDOW_TIME;
                } else {
                    ipData.count += 1;
                }

                if (ipData.count > MAX_REQUESTS) {
                    return res.status(429).json({
                        error: 'Too many requests. Please try again later.'
                    });
                }
            }

            const { uuid } = req.params;

            if (!uuid) {
                return res.status(404).json({
                    error: 'Required UUID user'
                });
            }

            const stats = await ServinetDatabase.getMeTecStats({ uuid });

            if (!stats) {
                return res.status(404).json({
                    error: 'Statistics not found'
                });
            }

            return res.status(200).json(stats);

        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    }


    static async getMeStats(req, res) {
        try {

            const { user } = req.session;

            if (!user) {
                return res.status(401).json({
                    error: 'Access not authorized'
                });
            }

            const { uuid } = req.params;

            const userId = uuid || user.user_id;

            const stats = await ServinetDatabase.getMeTecStats({
                userId
            });

            if (!stats) {
                return res.status(404).json({
                    error: 'Statistics not found'
                });
            }

            return res.status(200).json(stats);

        } catch (error) {
            console.error('Error al obtener estadísticas:', error);

            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    }


    static async userCheckMobileSessionActive(req, res) {




        try {

            const { user } = req.session;

            if (!user) {
                return res.status(401).json({
                    error: 'Access not authorized'
                });
            }

            console.log(user)
            const userinfo = await ServinetDatabase.getMe({ user_uuid: user.user_id });

            console.log("Validando si existe ")

            if (!userinfo) {
                console.log("Session vencida o nunca inició sesion")
                return res.status(401).json({
                    error: "Session vencida o nunca inició sesion"
                });

            }

            return res.status(200).json(
                {
                    user: userinfo,
                }
            );

        } catch (err) {
            console.error(err);

            return res.status(500).json({
                error: err.message
            });
        }
    }

    static async userLogout(req, res) {

        const { user } = req.session;

        if (!user) {
            return res.status(401).json({
                error: 'Access not authorized'
            });
        }

        await ServinetDatabase.logoutSession({ sessions_id: user.session_id, user_uuid: user.user_id });
        res
            .clearCookie('access_token')
            .status(200)
            .json({ status: true });
    }

    static async userMobileLogin(req, res) {
        try {
            const result = await AuthSchemas.login({
                bodyContent: req.body
            });

            if (result.error) {
                return res.status(400).json(result);
            }



            const userinfo = await ServinetDatabase.loginUser({ userObject: result.data });



            if (!userinfo) {
                return res.status(401).json({
                    error: "Usuario o contraseña incorrectos"
                });
            }
            const { password_hash: _, ...user } = userinfo;

            const accessTokenId = uuidv7();
            const refreshTokenId = uuidv7();
            const sessionId = uuidv7();
            const userId = user.user_uuid;
            console.log({
                accessTokenId,
                refreshTokenId,
                sessionId,
                userId
            });
            const jwtData = {
                userId,
                sessionId,
                accessTokenId,
                refreshTokenId,
            };

            const { accessToken, refreshToken } = await CreateTokens(jwtData);

            const userAgent = req.headers["user-agent"];

            const userIp =
                req.headers["x-forwarded-for"]?.split(",")[0] ||
                req.socket.remoteAddress;

            const sessionRevocable = {
                sessionId,
                userId,
                accessTokenId,
                refreshTokenId,
                userAgent,
                userIp,
            };

            await ServinetDatabase.setSession({ objectSession: sessionRevocable });


            return res.status(200).json(
                {
                    accessToken,
                    refreshToken,
                    user: user,
                }
            );

        } catch (err) {
            console.error(err);

            return res.status(500).json({
                error: err.message
            });
        }
    }


}