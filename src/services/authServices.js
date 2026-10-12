import jwt from 'jsonwebtoken'
import { SECRET_JWT_KEY, SECRET_JWT_REFRESH } from "../../config.js";
export const CreateTokens = async (jwtData) => {

    const accessToken = jwt.sign(
        {
            user_id: jwtData.userId,
            session_id: jwtData.sessionId,
            accessToken_id: jwtData.accessTokenId
        },
        SECRET_JWT_KEY,
        { expiresIn: "60m" }
    );

    const refreshToken = jwt.sign(
        {
            user_id: jwtData.userId,
            session_id: jwtData.sessionId,
            refreshToken_id: jwtData.refreshTokenId
        },
        SECRET_JWT_REFRESH,
        { expiresIn: "7d" }
    );

    const tokens = { accessToken, refreshToken }

    return tokens
}

