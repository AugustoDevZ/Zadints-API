
import sql from 'mssql';
import argon2 from 'argon2';


const config = {
    user: 'servinet_api',
    password: 'a16DA5x4sse8',
    server: '2.25.236.90',
    database: 'Servinet',
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    port: 1433
};

export const connection = sql.connect(config);

//.input('userId', sql.UniqueIdentifier, userId)
export class ServinetDatabase {

    static async getAnnounces() {

        const pool = await connection;
        const result = await pool
            .request()
            .execute('sp_GetAnnounces');

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset;
    }

    static async getAllOders() {

        const pool = await connection;
        const result = await pool
            .request()
            .execute('sp_GetOrders');

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset;
    }


    static async getMeTecStats({ userId }) {

        const pool = await connection;
        const result = await pool
            .request()
            .input('user_uuid', sql.UniqueIdentifier, userId)
            .execute('sp_GetMeTecStats');

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset;
    }

    static async loginUser({ userObject }) {

        const { username, password, usermail } = userObject;
        const pool = await connection;
        const result = await pool
            .request()
            .input('user_name', sql.VarChar(50), username)
            .input('email', sql.VarChar(50), usermail)
            .execute('sp_GetUserMovil');

        if (result.recordset.length === 0) {
            return null;
        }
        const user = result.recordset[0];

        const validPassword = await argon2.verify(
            user.password_hash,
            password
        );

        if (!validPassword) {
            return null;
        }

        return user;
    }


    static async getMe({ user_uuid }) {
        const pool = await connection;
        const result = await pool
            .request()
            .input('user_uuid', sql.UniqueIdentifier, user_uuid)
            .execute('sp_GetMeMovil');

        if (result.recordset.length === 0) {
            return null;
        }
        const user = result.recordset[0];
        return user;
    }

    static async setSession({ objectSession }) {

        const pool = await connection;
        await pool
            .request()
            .input('sessions_id', sql.UniqueIdentifier, objectSession.sessionId)
            .input('user_uuid', sql.UniqueIdentifier, objectSession.userId)
            .input('access_token_id', sql.UniqueIdentifier, objectSession.accessTokenId)
            .input('refresh_token_id', sql.UniqueIdentifier, objectSession.refreshTokenId)
            .input('user_agent', sql.VarChar, objectSession.userAgent)
            .input('user_ip', sql.VarChar, objectSession.userIp)
            .execute('sp_SetSession');

        return null;
    }


    static async getSession({ sessionId, accessTokenId }) {
        const pool = await connection;
        const result = await pool
            .request()
            .input('sessions_id', sql.UniqueIdentifier, sessionId)
            .input('access_token_id', sql.UniqueIdentifier, accessTokenId)
            .execute('sp_GetSession');

        return result.recordset[0] ?? null;
    }

    static async logoutSession({ user_uuid, sessions_id }) {

        const pool = await connection;
        await pool
            .request()
            .input('sessions_id', sql.UniqueIdentifier, sessions_id)
            .input('user_uuid', sql.UniqueIdentifier, user_uuid)
            .execute('sp_logoutSession');
    }
}

/*
{{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjp7ImRlZiI6eyJ0eXBlIjoic3RyaW5nIiwiZm9ybWF0IjoidXVpZCIsImNoZWNrIjoic3RyaW5nX2Zvcm1hdCIsImFib3J0IjpmYWxzZSwidmVyc2lvbiI6InY3IiwicGF0dGVybiI6e319LCJ0eXBlIjoic3RyaW5nIiwiZm9ybWF0IjoidXVpZCIsIm1pbkxlbmd0aCI6bnVsbCwibWF4TGVuZ3RoIjpudWxsfSwiYWNjZXNzVG9rZW5faWQiOnsiZGVmIjp7InR5cGUiOiJzdHJpbmciLCJmb3JtYXQiOiJ1dWlkIiwiY2hlY2siOiJzdHJpbmdfZm9ybWF0IiwiYWJvcnQiOmZhbHNlLCJ2ZXJzaW9uIjoidjciLCJwYXR0ZXJuIjp7fX0sInR5cGUiOiJzdHJpbmciLCJmb3JtYXQiOiJ1dWlkIiwibWluTGVuZ3RoIjpudWxsLCJtYXhMZW5ndGgiOm51bGx9LCJpYXQiOjE3OTE0Njg2MzcsImV4cCI6MTc5MTQ2OTUzN30.dLP6wVbbPmYjsNSuV0dc7Humk2u8Gn0PFrgdQlBk9u4",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjp7ImRlZiI6eyJ0eXBlIjoic3RyaW5nIiwiZm9ybWF0IjoidXVpZCIsImNoZWNrIjoic3RyaW5nX2Zvcm1hdCIsImFib3J0IjpmYWxzZSwidmVyc2lvbiI6InY3IiwicGF0dGVybiI6e319LCJ0eXBlIjoic3RyaW5nIiwiZm9ybWF0IjoidXVpZCIsIm1pbkxlbmd0aCI6bnVsbCwibWF4TGVuZ3RoIjpudWxsfSwicmVmcmVzaFRva2VuX2lkIjp7ImRlZiI6eyJ0eXBlIjoic3RyaW5nIiwiZm9ybWF0IjoidXVpZCIsImNoZWNrIjoic3RyaW5nX2Zvcm1hdCIsImFib3J0IjpmYWxzZSwidmVyc2lvbiI6InY3IiwicGF0dGVybiI6e319LCJ0eXBlIjoic3RyaW5nIiwiZm9ybWF0IjoidXVpZCIsIm1pbkxlbmd0aCI6bnVsbCwibWF4TGVuZ3RoIjpudWxsfSwiaWF0IjoxNzkxNDY4NjM3LCJleHAiOjE3OTIwNzM0Mzd9.j-uAeqDJ08ksR_ZvqkyRqvWF3xBo5lkcf342CUAHGic",
  "user": {
    "user_uuid": "ED048432-C12A-4925-B38E-A9A5E1085E16",
    "display": "Augusto",
    "email": "tester@gmail.com",
    "role": "792793D9-0878-4AAE-A40C-70DA9C23F951",
    "create_at": "2026-10-04T17:28:58.122Z",
    "perfil_img": null,
    "role_uuid": "792793D9-0878-4AAE-A40C-70DA9C23F951",
    "name": "Owner",
    "hexColor": "#540010"
  }
}


*/