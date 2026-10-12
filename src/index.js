import express from "express"
import { corsMiddleware } from "./middleware/cors.js";
import { zruteRouter } from "./routes/zruteRoutes.js";
import { aylluRouter } from "./routes/aylluRoutes.js";
import { ValidateJson } from "./middleware/validateJson.js";
import { zadintsRouter } from "./routes/zadintsRoutes.js";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/verifyToken.js";
import { augustoRouter } from "./routes/augustoRoutes.js";
import { servinetRouter } from "./routes/servinetRouter.js";

const app = express();
app.use(corsMiddleware());
app.use(express.json())
app.use(cookieParser())
app.disable('x-powered-by')
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
//app.use(verifyToken);
app.use(ValidateJson);


const PORT = process.env.PORT ?? 2026
const entrepriseName = "zadints"
const portafolio = "augusto"

app.use(`/${entrepriseName}`, zadintsRouter);
//app.use(`/${entrepriseName}/zrute`, zruteRouter)
app.use(`/${entrepriseName}/ayllu`, aylluRouter);

app.use(`/${entrepriseName}/servinet-movil`, servinetRouter);

app.use(`/${portafolio}`, augustoRouter)

app.listen(PORT, () => {
  console.log(`Server Listo en el puerto http://localhost:${PORT}/${entrepriseName}`)
  console.log(`Server Listo en el puerto http://localhost:${PORT}/${portafolio}`)
});