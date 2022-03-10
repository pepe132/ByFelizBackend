const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

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

const revalidarToken = async (req, res = response ) => {

    const { _id, nombre,correo } = req.usuario;

    // Generar JWT
    const token = await generarJWT( _id, nombre );

    res.json({
        ok: true,
        _id,
        nombre,
        correo,
        token,
    })
}

const googleSingIn=async(req,res=response)=>{
    const {id_token}=req.body;

    try {
        const {nombre,img,correo}=await googleVerify(id_token)

        let usuario=await Usuario.findOne({correo});

        if (!usuario){
            //tengo que crearlo
            const data={
                nombre,
                correo,
                password:':P',
                img,
                rol:'USER_ROLE',
                google:true

            }
            usuario=new Usuario(data)

            await usuario.save()
            
        }

        //si el usuario en BD 

        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Hable con el admin, usuario bloqueado'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'El token no se pudo verificar'
        })
        
    }

}

module.exports={
    login,
    revalidarToken,
    googleSingIn
}