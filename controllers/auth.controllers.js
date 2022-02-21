const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");

const Usuario=require('../models/usuario')

const login=async(req,res=response)=>{

    const {correo,password}=req.body;

    try {

        //verifica si el correo existe 
        const usuario=await Usuario.findOne({correo})
        if (!usuario){
            return res.status(400).json({
                msg:'Correo inexistente'
            })
            
        }

        //si el usuadio esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg:'Estado inactivo'
            })
            
        }

        //verificar la contraseña

        const validPassword=bcryptjs.compareSync(password,usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg:'Contraseña incorrecta'
            })
            
        }

        //generar jwt

        const token=await generarJWT(usuario.id)

        res.json({
            usuario,
            token
            
        })

        
    } catch (error) {
        console.log(error);
        return res.status.json({
            msg:'Fallo interno del sistema '
        })
        
    }    
}

module.exports={
    login
}