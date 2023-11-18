const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const env = require('dotenv')

//Middlewares
const val = require('../handlers/validator');
const errors = require('../servicios/ErrorMessages')
const fileBBDD = require('../storageemulado/FileBBDD')
const authHandler = require('../handlers/authhandler')

//Configuro las variables de entorno del archivo  .env
env.config();

//Definicion de esquema

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - user
 *         - password
 *       properties:
 *         user:
 *           type: string
 *           description: EL nombre de usuario.
 *         password:
 *           type: string
 *           description: La contraseña proporcionada
 *       example:
 *         user: Ignacio
 *         password: abcd1234
 */

//Endpoints

/**
 * @openapi
 * tags:
 *   name: Auth Bearer JWT
 *   description: Autorizacion a travez de JWT.
 * /api/auth/gettoken:
 *   post:
 *     summary: Obtiene el token a travez de un usuario y contraseña.
 *     tags: [Auth Bearer JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Operacion correcta.
 *       400:
 *         description: Error en los parametros proporcionados.
 *       401:
 *         description: Los valores no verifican la validacion.
 *       500:
 *         description: Error en el servidor.
 *
 */
router.post('/gettoken', (req,res)=>{
    try{
        const { user, password}= req.body;
        if(val.nullorempty(user)&& val.nullorempty(password)){
            console.log("Auth param error:",user,password);
            return res.status(400).json(errors.getMessage(400));
        }
        let existe = fileBBDD.existeUsuario(user,password);
        if(existe){
            let tokencito = jwt.sign({ user}, process.env.TOKENSECRET, { expiresIn: '1h' })
            return  res.status(200).json(tokencito);
        }else {
            return  res.status(401).json(errors.getMessage(401));
        }

    }catch(error){
        console.log("Error en auth endpoint:",error)
        return res.status(500).json(errors.getMessage(500));
    }
})

/**
 * @openapi
 * tags:
 *   name: Auth Bearer JWT
 *   description: Autorizacion a travez de JWT.
 * /api/auth/validartoken:
 *   post:
 *     summary: Valida si un token es correcto o no.
 *     tags: [Auth Bearer JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                token:
 *                  type: string
 *     responses:
 *       200:
 *         description: Operacion correcta.
 *       400:
 *         description: Error en los parametros proporcionados.
 *       401:
 *         description: Los valores no verifican la validacion.
 *       500:
 *         description: Error en el servidor.
 *
 */
router.post('/validartoken', (req,res)=>{
    try{
        const { token}= req.body;
        if(val.nullorempty(token)){
            console.log("Auth token error:",token);
            return res.status(400).json(errors.getMessage(400));
        }
        let response = authHandler.validarToken(token);
        if(response == null){
            return res.status(401).json(errors.getMessage(401));
        }else{
            return res.status(200).json(response);
        }

    }catch(error){
        console.log("Error en auth endpoint:",error)
        return res.status(500).json(errors.getMessage(500));
    }
})


module.exports = router;