const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const nodemailer=require('nodemailer')
const jwt=require('jsonwebtoken');
require('dotenv').config();


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

    const { _id, nombre,correo,rol,google } = req.usuario;

    // Generar JWT
    const token = await generarJWT( _id, nombre );

    res.json({
        ok: true,
        _id,
        nombre,
        correo,
        token,
        rol,
        google
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

const olvidarContraseña=async(req,res=response)=>{
        if (req.body.correo===''){
            res.status(400).json({
                msg:'El email es requerido'
            })
            
        }

        try {
            const user=await Usuario.findOne({correo:req.body.correo})
            if (!user) {
                return res.status(403).json({
                    msg:'No existe ese email'
                })  
            }

            const token=jwt.sign({_id:user._id},'regret0ffall0wqu33n',{expiresIn:'1h'});
            user.updateOne({
                tokenResetPassword:token
            })

            const verificationLink=`https://byfeliz.netlify.app/resetPassword/${user._id}/${token}`

            const transporter=nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:`${process.env.EMAIL_ADRESS}`,
                    pass:`${process.env.EMAIL_PASSWORD}`
                },
                port: 587,
            });

            const mailOptions={
                from:'byfeliz.asociacion@gmail.com',
                to:`${user.correo}`,
                
                subject:'Enlace para recuperar su contraseña en ByFeliz',
                text:`Link de activacion: ${verificationLink} `
            
            };

            transporter.sendMail(mailOptions,(err,response)=>{
                if (err){
                    console.log('Ha ocurrido un error:',err);
                }else{
                    //console.log('Respuesta:',response);
                    res.status(200).json('El email para recuperacion ha sido enviado')
                }

            })

        
        } catch (error) {
            res.status(500).json({
                msg:'Ha ocurrido un error',
                error
            })
            console.log(error);
            
        }
    }


    const reestablecerContraseña=async(req,res=response)=>{

        try {
            req.body.password=await bcryptjs.hash(req.body.password,10)
            const resetPassword=await Usuario.updateOne(
                {"_id":req.params.id}, {$set:{"password":req.body.password}}
            )

            res.status(201).json({
                resetPassword,
                msg:'Contraseña cambiada con exito'
            })
            
        } catch (error) {
            res.status(500).json({
                msg:'Este error',
                error
            })
            
        }
    }

module.exports={
    login,
    revalidarToken,
    googleSingIn,
    olvidarContraseña,
    reestablecerContraseña,
    
}