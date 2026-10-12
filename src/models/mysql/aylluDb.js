import Database from 'better-sqlite3'
import mysql from 'mysql2/promise'
import { uuidv7 } from 'uuidv7';
import bcrypt from 'bcrypt'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3302,
    password: '',
    database: 'ZadintsUsers'
}

export const connection = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export class AylluModel {
    static async getItems() {
        const [items] = await connection.query('SELECT stock_id, items_category, add_at, expired_at, items_name, items_stock, items_img, user_id FROM items')
        console.log(items)
        return items
    }



    static async createItems({ input }) {
        const id = uuidv7();

        const {
            item: {
                itemName,
                category,
                expiredAt,
                itemStock,
                itemImage
            },
            user: {
                userId
            }
        } = input

        const expiredAtClean = expiredAt.replace('T', ' ').substring(0, 19);

        try {
            await connection.query(
                `INSERT INTO items (stock_id, items_category, expired_at, items_name, items_stock, items_img, user_id)
                VALUES (?,?,?,?,?,?,?);
                
                `,
                [
                    id,
                    category,
                    expiredAtClean,
                    itemName,
                    itemStock,
                    itemImage,
                    userId
                ]
            );
        } catch (e) {
            throw new Error(e)
        }

        return id
    }
}