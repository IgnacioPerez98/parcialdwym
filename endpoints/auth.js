const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const env = require('dotenv')

env.config();
router.post('/gettoken', (req,res)=>{
    try{


    }catch(error){
        console.log("Error en auth endpoint:",error)
        return res.status(500).json({Message:"Error del servidor."});
    }
})



module.exports = router;