const crypto = require('crypto')
let ServicioEncriptacion = {
    cifrar: function (text){
        return crypto.createHash('sha512').update(text).digest('hex');
    },
    assert: function (hash, textSinHash){
        let hashedText = crypto.createHash('sha512').update(textSinHash).digest('hex');
        return hashedText === hash;
    }
}
module.exports = ServicioEncriptacion;