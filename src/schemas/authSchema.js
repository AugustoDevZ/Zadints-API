import { z } from 'zod'
export class AuthSchemas {
    /*
    {
        username: "",
        password: ""
    } */

    static login({ bodyContent }) {
        const calculateRuteSchema = z.object({
            username: z.string()
                .min(2, "El usuario debe tener al menos 3 caracteres")
                .max(30, "El usuario no puede superar los 30 caracteres")
                .regex(
                    /^[a-zA-Z0-9_]+$/,
                    "Solo se permiten letras, números y guiones bajos (_)"
                )
                .optional()
                .nullable(),
            password: z.string()
                .min(8, "Mínimo 8 caracteres")
                .max(50, "Máximo 50 caracteres")
                .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
                .regex(/[a-z]/, "Debe contener al menos una minúscula")
                .regex(/[0-9]/, "Debe contener al menos un número")
                .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
            usermail: z.string()
                .email("Correo electrónico inválido")
                .optional()
                .nullable()
        });

        return calculateRuteSchema.safeParse(bodyContent)
    }


    /*
    {
        handle: "",
        password: "",
        email: "",
        displayName: "",
        avatar: "",
        
    } */
    static register({ bodyContent }) {
        const registerSchema = z.object({
            handle: z.string()
                .min(3, "El usuario debe tener al menos 3 caracteres")
                .max(30, "El usuario no puede superar los 20 caracteres")
                .regex(
                    /^[a-zA-Z0-9]+$/,
                    "Solo se permiten letras y números"
                ),
            displayName: z.string()
                .min(3, "El usuario debe tener al menos 3 caracteres")
                .max(30, "El usuario no puede superar los 20 caracteres")
                .regex(
                    /^[a-zA-Z0-9_]+$/,
                    "Solo se permiten letras y números y guion bajos"
                ),
            password: z.string()
                .min(8, "Mínimo 8 caracteres")
                .max(50, "Máximo 50 caracteres")
                .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
                .regex(/[a-z]/, "Debe contener al menos una minúscula")
                .regex(/[0-9]/, "Debe contener al menos un número")
                .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),
            email: z.string().email("email no es un correo válido"),

            avatar: z.url({ protocol: /^https$/ }).optional().nullable()

        });

        return registerSchema.safeParse(bodyContent)
    }
}