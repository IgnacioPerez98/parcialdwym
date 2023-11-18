const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const env = require('dotenv')

//Middlewares
const val = require('../handlers/validator');
const errors = require('../servicios/ErrorMessages')
const fileBBDD = require('../storageemulado/FileBBDD')
const authHandler = require('../handlers/authhandler')
const Persons = require("../models/persons");


//Esquema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     Persons:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - email
 *         - telefono
 *         - empresa
 *       properties:
 *         nombre:
 *           type: string
 *           description: EL nombre de usuario.
 *         apellido:
 *           type: string
 *           description: EL apellido de usuario.
 *         email:
 *           type: string
 *           description: EL email de usuario.
 *         telefono:
 *           type: string
 *           description: EL telefono de usuario.
 *         empresa:
 *           type: string
 *           description: El nombre lugar de trabajo de usuario.
 *       example:
 *         nombre: Ignacio
 *         apellido: Perez
 *         email: nachopp98@gmail.com
 *         telefono: "098110564"
 *         empresa: Kielce S.A.
 */

//Endpoints



/**
 * @swagger
 * tags:
 *   name: Gestion de Personas
 *   description: Crea y elimina personas.
 * /api/personas/getpersonas/{nombre}/{apellido}:
 *   get:
 *     summary: Obtiene una persona.
 *     tags: [Gestion de Personas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: apellido
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Operacion correcta.
 *       400:
 *         description: Error en los parametros proporcionados.
 *       401:
 *         description: Los valores no verifican la validacion.
 *       404:
 *         description: Los valores no se encontraron.
 *       500:
 *         description: Error en el servidor.
 */
router.get('/getpersonas/:nombre/:apellido',(req, res)=>{
    try {
        let status = authHandler.validartokenfromheader(req);
        if(status !== 200) return  res.status(status).json(errors.getMessage(status));

        const nombre = req.params.nombre;
        const apellido = req.params.apellido;
        if (val.nullorempty(nombre) || val.nullorempty(apellido)){
            return res.status(400).json(errors.getMessage(400));
        }

        let opstatus = fileBBDD.buscarpersona(nombre,apellido);
        if(typeof opstatus === "number"){
            return  res.status(opstatus).json(errors.getMessage(opstatus));
        }else {
            return res.status(200).json(opstatus);
        }
    }catch (error){
        return res.status(500).json(errors.getMessage(500));
    }
})


/**
 * @swagger
 * tags:
 *   name: Gestion de Personas
 *   description: Crea y elimina personas.
 * /api/personas/addpersona:
 *   post:
 *     summary: Crear una nueva persona.
 *     tags: [Gestion de Personas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persons'
 *     responses:
 *       200:
 *         description: Operacion correcta.
 *       400:
 *         description: Error en los parametros proporcionados.
 *       401:
 *         description: Los valores no verifican la validacion.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/addpersona',(req, res)=>{
   try{
       let status = authHandler.validartokenfromheader(req);
       if(status !== 200) return res.status(status).json(errors.getMessage(status));
       const {nombre, apellido, email, telefono, empresa } = req.body;
       if(val.nullorempty(nombre) || val.nullorempty(apellido) || val.nullorempty(email) || val.nullorempty(telefono) || val.nullorempty(empresa)){
           return res.status(400).json(errors.getMessage(400));
       }
       let persona = new Persons (nombre, apellido, email, telefono, empresa );
       fileBBDD.agregarpersona(persona)
       return res.status(200).json(errors.getMessage(200));

   }catch (error){
       return res.status(500).json(errors.getMessage(500));
   }
});



/**
 * @swagger
 * tags:
 *   name: Gestion de Personas
 *   description: Crea y elimina personas.
 * /api/personas/deletepersonas/{nombre}/{apellido}:
 *   delete:
 *     summary: Elimina una persona.
 *     tags: [Gestion de Personas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: apellido
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Operacion correcta.
 *       400:
 *         description: Error en los parametros proporcionados.
 *       401:
 *         description: Los valores no verifican la validacion.
 *       404:
 *         description: Los valores no se encontraron.
 *       500:
 *         description: Error en el servidor.
 */
router.delete('/deletepersonas/:nombre/:apellido', (req, res)=>{
    try {
        let status = authHandler.validartokenfromheader(req);
        if(status !== 200) return  res.status(status).json(errors.getMessage(status));

        const nombre = req.params.nombre;
        const apellido = req.params.apellido;
        if (val.nullorempty(nombre) || val.nullorempty(apellido)){
            return res.status(400).json(errors.getMessage(400));
        }

        let opstatus = fileBBDD.eliminarpersona(nombre,apellido);
        return  res.status(opstatus).json(errors.getMessage(opstatus));

    }catch (error){
        return res.status(500).json(errors.getMessage(500));
    }
})

module.exports = router;