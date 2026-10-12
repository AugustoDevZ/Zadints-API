import { object, z } from 'zod'
const base64ImageRegex = /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$|^[A-Za-z0-9+/=]+$/;
export class AylluSchemas {

    /* ----------------- forma del json input
    {
        "item": {
            "itemName": "Papas",
            "category": 1,
            "expiredAt": "00-qq3-3",
            "itemStock": 44,
            "itemImage": "alfas92wj81..."
        },
        "user": {
            "userId": "fasadds"
        }
    }
    */
    static createItem({ bodyContent }) {
        const itemSchema = z.object({
            item: z.object({
                itemName: z.string()
                    .min(1, "El nombre no puede estar vacío")
                    .max(50, "El nombre no puede superar los 20 caracteres"),
                category: z.number()
                    .int("La categoría debe ser un número entero"),
                expiredAt: z.iso.datetime(),
                itemStock: z.number()
                    .int()
                    .min(0, "El stock no puede ser negativo"),
                itemImage: z.httpUrl()
            }),
            user: z.object({
                userId: z.string()
            })

        });

        return itemSchema.safeParse(bodyContent)
    }


}

