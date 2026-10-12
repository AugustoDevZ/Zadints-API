import { z } from 'zod'
export class ZruteSchemas {
    static async calculateRuteSchema({ bodyContent }) {
        const calculateRuteSchema = z.object({
            latitud: z.number({
                required_error: "La latitud es obligatoria",
                invalid_type_error: "La latitud debe ser un número decimal"
            })
                .min(-90, { message: "La latitud no puede ser menor a -90" })
                .max(90, { message: "La latitud no puede ser mayor a 90" }),

            longitud: z.number({
                required_error: "La longitud es obligatoria",
                invalid_type_error: "La longitud debe ser un número decimal"
            })
                .min(-180, { message: "La longitud no puede ser menor a -180" })
                .max(180, { message: "La longitud no puede ser mayor a 180" })
        });

        return calculateRuteSchema.safeParse(bodyContent)
    }

}

/* ----------------- forma del json input
{
  "latitud": -12.0463,
  "longitud": -77.0427
}
*/