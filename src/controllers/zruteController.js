import { data } from "../database/data.js";
import { ZruteSchemas } from "../schemas/zruteSchema.js";




/*


const zruteServices = require("../services/zruteServices")
const ResponseDto = require("../Models/ResponseDto")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


Zod Schemas: Asegura que el JSON que entra sea idéntico a lo que esperas.
Controllers: Atiende la petición HTTP.
Services: Procesa la inteligencia, reglas de negocio y cálculos de la aplicación.
Models: Define la tabla de PostgreSQL y ejecuta el SQL/Query directo hacia la base de datos.
        ¿Para conectar tus 
*/

export class ZruteController {
    static async calculateRute(req, res) {
        const result = await ZruteSchemas.calculateRuteSchema({ bodyContent: req.body })
        if (result.error) {
            return res.status(400).json({ errors: result.error.flatten().fieldErrors })
        }

        const dataRute = ZruteModel.RuteCalculate({ coordsObjetc: result.data })

        res.status(200).json(dataRute)
    }
}

/*





const getAllZrute = (req, res) => {

    res.send({ status: 'None', ask: 'What are you looking for, friend?' });

    //res.json(allWorkouts);
};

const getProfileZrute = (req, res) => {

    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).send({
            status: "ERROR",
            message: "Token inválido"
        });
    }

    console.log("ID:", userId);

    const userData = zruteServices.getProfileZrute(userId);

    if (!userData) {
        const responseDto = new ResponseDto(404, "No se encontró el usuario", null)
        return res.status(404).send(responseDto);
    }

    const responseDto = new ResponseDto(200, "", userData)
    res.status(200).send(responseDto)
};


const postViableRute = (req, res) => {

    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).send({
            status: "ERROR",
            message: "Token inválido"
        });
    }

    const { body } = req;


    if (!body.ubication || !body.destino) {

        return res.status(404).send({
            error: "No se ingresaron todos los datos."
        });
    }

    console.log("Data:", body);


    //aqui logica de busacr pro coordenadas

    const userData = zruteServices.getProfileZrute(userId);

    console.log("Data:", userData);
    if (!userData) {
        return res.status(404);
    }

    const responseDto = new ResponseDto(200, "", userData)
    res.status(200).send(responseDto)
};

const postLoginUserZrute = async (req, res) => {


    const { body } = req;

    if (!body.email || !body.password) {

        return res.status(404).send({
            error: "No se ingresaron todos los datos."
        });
    }

    const { email, password } = req.body;

    const userMail = await zruteServices.findUserByEmail(email);

    if (!userMail) {
        return res.status(404).send({
            error: "Usuario o contraseña incorrectos."
        });
    }

    const isValid = await bcrypt.compare(password, userMail.password);

    if (!isValid) {
        return res.status(404).send({
            error: "Usuario o contraseña incorrectos."
        });
    }


    const token = jwt.sign(
        {
            id: userMail.id
        },
        "SECRET_KEY",
        {
            expiresIn: "1h"
        }
    );

    res.status(202).send({
        status: "OK",
        token
    });
};

const postCreateUserZrute = async (req, res) => {

    const { body } = req;

    if (!body.name || !body.theme || !body.lang || !body.email || !body.password) {
        return res.status(400).send({ error: "falta datos" });
    }

    const userId = await zruteServices.createNewWorkout(body);

    if (!userId) {
        return res.status(409).send({
            exist: "El usuario ya existe."
        });
    }

    const token = jwt.sign(
        {
            id: userId
        },
        "SECRET_KEY",
        {
            expiresIn: "1h"
        }
    );

    res.status(201).send({
        status: "OK",
        token
    });



    //res.send(`Create workout ${req.params.workoutId}`);

    // status:
    // 200 ok my friend
    // 400 donde vas?
    // 500 error del servidor
    // https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status
    //
};






const updateOneWorkout = (req, res) => {
    const updateWorkouts = workoutServices.updateOneWorkout(req.params.workoutId);
    res.send(`Update workout ${req.params.workoutId}`);
};
const deleteOneWorkout = (req, res) => {
    workoutServices.deleteOneWorkout(req.params.workoutId);
    res.send(`Delete workout ${req.params.workoutId}`);
};

module.exports = {
    getAllZrute,
    getProfileZrute,
    postLoginUserZrute,
    postCreateUserZrute,
    postViableRute,
};


*/