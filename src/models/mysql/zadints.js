import Database from 'better-sqlite3'
import mysql from 'mysql2/promise'
import { uuidv7 } from 'uuidv7';
import bcrypt from 'bcrypt'
import { string } from 'zod';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3307,
    password: '',
    database: 'ZadintsUsers'
}

export const connection = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


export class ZadintsDatabase {

    static async getUserCosmetic({ userId }) {
        const [rows] = await connection.query(
            `SELECT * FROM user_cosmetic WHERE user_id = ?`,
            [userId]
        )

        if (rows.length === 0) return null;

        return rows[0]
    }

    /**
     * @description the funtion is save in database.
     * @param {string} userId - The user id
     * @param {string} accessToken - The refresh token.
     * @param {string} refreshToken - The 15-minute session token.
    */
    static async saveSession({ userObject }) {
        try {
            const exiredAt = userObject.dataDecoded.exp;
            const createAt = userObject.dataDecoded.iat;

            const rows = await connection.query(
                `INSERT INTO auth (
                    session_id,
                    user_id, 
                    access_token_id, 
                    refresh_token_id, 
                    user_agent, 
                    ip_address,
                    create_at, 
                    expired_ats
                ) VALUES (UUID_TO_BIN(?),?,?,?, ?, ?); `,
                [
                    userObject.sessionId,
                    userObject.userId,
                    userObject.accessTokenId,
                    userObject.refreshTokenId,
                    userObject.userAgent,
                    userObject.userIp,
                    userObject.createAt,
                    userObject.exiredAt
                ]
            );
        } catch { Error('Un error al guardar estado de sesión del usuario.') }
    }


    static async saveSession(
        userId,
        accessTokenId,
        refreshTokenId,
        dataDecoded,
        userAgent,
    ) {
        try {
            const exiredAt = dataDecoded.exp;
            const createAt = dataDecoded.iat;

            const rows = await connection.query(
                `INSERT INTO auth (
                user_id, accessTokenId , refreshTokenId, user_agent, create_at, expired_at
                ) VALUES (UUID_TO_BIN(?),?,?,?, ?, ?); `,
                [userId, accessTokenId, refreshTokenId, userAgent, createAt, exiredAt]
            );
        } catch { Error('Un error al guardar estado de sesión del usuario.') }
    }

    /*
    static async settingUbication(ip, userId, trusted) {

        const [rows] = await connection.query(
            `SELECT * FROM trusted_ips WHERE ip_address = ? AND user_id = UUID_TO_BIN(?);`,
            [ip, userId]
        );

        if (rows.length === 0) {
            return saveLocation(ip, userId, trusted);
        }

        const [
            last_seen,
            request_count,
            trusted
        ] = rows

        request_count++;


        const now = new Date();

        const diffMs = now - lastSeen;

        if (diffMs < 1 * 60 * 1000) {
            console.log("Han pasado menos de 1 minutos.");
            return false;
        }

        if (request_count >= 20) {
            trusted = true;
        }

        //implemebtar rate limmit con redis



    }
*/
    static saveLocation(ip, userId, trusted) {

    }


    static async getInfoMe({ userSession }) {
        const user_id = userSession
        console.log(user_id)
        const rows = await connection.query(
            `SELECT 
                    BIN_TO_UUID(user_id) AS user_id, 
                    user_handle,  
                    user_displayname, 
                    user_status, 
                    user_status_lore, 
                    user_avatar, 
                    created_at, 
                    updated_at
                FROM users 
                WHERE user_id = UUID_TO_BIN(?);`,
            [user_id]
        );

        return rows[0];
    }
    static async loginUser({ userObject }) {

        const { username, password } = userObject;

        const [rows] = await connection.query(
            `SELECT 
                    BIN_TO_UUID(user_id) AS user_id, 
                    user_handle,  
                    user_displayname, 
                    user_password,
                    created_at
                FROM users 
                WHERE user_handle = OR user_email = ?;`,
            [username, username]
        );

        const [user] = rows;
        if (!user) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.user_password);

        if (!isValid) {
            return null;
        }

        const { user_password, ...userData } = user;

        return userData;
    }



    static async AddUser(basicUserData) {


        const userPassword = bcrypt.hashSync(basicUserData.password, 10)

        try {
            await connection.query(
                `INSERT INTO users (
                    user_id, 
                    user_handle, 
                    user_displayname, 
                    user_password, 
                    user_email
                )
                VALUES (UUID_TO_BIN(?),?,?,?,?);
                
                `,
                [
                    basicUserData.userId,
                    basicUserData.handle,
                    basicUserData.displayName,
                    userPassword,
                    basicUserData.email
                ]
            );

        } catch (e) {
            throw new Error(e)
        }




    }

    static async AddUserCosmetic(userId, avatar) {

        console.log(userId)
        if (!avatar) {
            try {
                await connection.query(
                    `INSERT INTO users (user_id) VALUES (UUID_TO_BIN(?));`,
                    [userId]
                );
                return;
            } catch (e) {
                throw new Error(e)
            }
        }

        const stringQuery = `INSERT INTO users (user_id, user_avatar) VALUES (UUID_TO_BIN(?), ?);`

        try {
            await connection.query(
                stringQuery, [userId, avatar]
            );
        } catch (e) {
            throw new Error(e)
        }
    }

}