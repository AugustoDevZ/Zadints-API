

export const ValidateJson = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            status: "error",
            message: "El cuerpo de la petición no es un JSON válido. Revisa las comillas o la sintaxis."
        });
    }
    next();
}