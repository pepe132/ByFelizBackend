const { response, request } = require('express')
const jwt=require('jsonwebtoken')

const Usuario=require('../models/usuario')

const validarJWT=async(req=request,res=response,next)=>{

    const token=req.header('x-token')//este es el header que se va a mandar
    
    if (!token) {
        return res.status(401).json({
            msg:'No hay token en la peticion'
        });      
    }

    try {

        const {_id}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);

       const  usuario=await Usuario.findById(_id);

       if (!usuario) {
        return res.status(401).json({
            msg:'Token no valido, el usuario no existe '
        })
           
       }

       //verificar si el _id tiene estado en true

       if (!usuario.estado) {
           return res.status(401).json({
               msg:'Token no valido'
           })
           
       }

        req.usuario=usuario

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Token no valido'
        })
        
    }


    

}

module.exports={
    validarJWT
}