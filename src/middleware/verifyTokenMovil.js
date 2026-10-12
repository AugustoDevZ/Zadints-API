import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../../config.js';
import { ServinetDatabase } from '../models/sqlserver/servinet.js';

export const verifyTokenMovil = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    req.session = {
        user: null
    };

    if (!authHeader) {
        return res.status(401).json({
            error: 'Token requerido'
        });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            error: 'Formato de token inválido'
        });
    }

    try {
        const data = jwt.verify(token, SECRET_JWT_KEY);
        console.log('----------JWT--------------')
        console.log(data)
        console.log('------------------------')

        const session = await ServinetDatabase.getSession({
            sessionId: data.session_id,
            accessTokenId: data.accessToken_id
        });

        console.log('----------Session--------------')
        console.log(session)
        console.log('------------------------')

        if (!session || session.revoked_at !== null) {
            return res.status(401).json({
                error: 'Sesión revocada o no encontrada'
            });
        }

        if (session.user_uuid !== data.user_id) {
            return res.status(401).json({
                error: 'Sesión no corresponde al usuario'
            });
        }

        if (new Date(session.expires_at) <= new Date()) {
            return res.status(401).json({
                error: 'Sesión expirada'
            });
        }

        req.session = {
            user: data,
        };

        console.log(req.session);

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(
                { message: 'La sesión ha expirado', code: 'TOKEN_EXPIRED' }
            );
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401)
                .json({
                    message: 'Token inválido', code: 'TOKEN_INVALID'

                });
        }

        return res.status(500)
            .json({ message: 'Error al verificar el token' });
    }
};