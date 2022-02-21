const {response}=require('express');

const bcryptjs=require('bcryptjs')

const Usuario=require('../models/usuario');

 const usuariosGet=async(req, res=response)=> {

    const {limite=5,desde=1}=req.query


    const [total,usuarios]=await Promise.all([//promise.all es para ejecutar acciones de manera simultanea
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
            .skip(Number(desde))
            .limit(Number(limite))

    ]);
    
    res.json({total,usuarios})
   
}


const usuariosPut=async(req,res=response)=>{

    const {id}=req.params
    const {_id,password,google, correo,...resto}=req.body//son los datos que no quiero actualizar

    //validra contra base de datos

    if (password){
        const salt=bcryptjs.genSaltSync();
        resto.password=bcryptjs.hashSync(password,salt)    
    }
    
    const userDB=await Usuario.findByIdAndUpdate(id,resto)

    res.json(userDB)
    
}

const usuariosPost=async(req,res=response)=>{

    const {nombre,correo,password,rol}=req.body
    const usuario=new Usuario({nombre,correo,password,rol});//es una nueva instancia de mi usuario 

    //en criptar la contraseña

    const salt=bcryptjs.genSaltSync();
    usuario.password=bcryptjs.hashSync(password,salt)

    //guardar en base de datos

    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosDelete=async(req,res=response)=>{

    const {id}=req.params;
    const usuario=await Usuario.findByIdAndUpdate(id,{estado:false})
    res.json(usuario)
}

module.exports={
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}