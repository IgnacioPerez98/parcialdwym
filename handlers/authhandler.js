const jwt = require("jsonwebtoken");
let authHandler = {

    validarToker : function (token){
        try {
            let resultado =  jwt.verify(token,process.env.TOKENSECRET.toString())
            return resultado ;
        }catch (error){
            console.log("Error Handler Token", error);
            return null;
        }
    }
}
module.exports =authHandler;