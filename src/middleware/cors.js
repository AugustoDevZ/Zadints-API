import cors from 'cors'
import { error } from 'node:console'

const ACCEPTED_ORIGIN = [
    'http://localhost:8080',
    'zadins.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGIN } = {}) => cors({
    origin: (origin, callback) => {
        if (ACCEPTED_ORIGIN.includes(origin)) {
            return callback(null, true)
        }

        if (!origin) {
            return callback(null, true)
        }

        return callback(new Error('No tienes permiso para acceder a la api'))
    }
})