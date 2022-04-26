const { response } = require("express");
const Categoria = require("../models/categoria");

const crearCategoria=async(req,res=response)=>{

    const nombre=req.body.nombre.toUpperCase();

    const categoriaDB=await Categoria.findOne({nombre});

    if (categoriaDB) {//si categoria db no es nula
        res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre} ya existe`
        }) 
    }

    //generar la data a guardar

    const data={
        nombre,
        usuario:req.usuario._id//asi es como mongo graba el id
    }

    const categoria= new Categoria(data);

    //guardar db

    await categoria.save();

    res.status(201).json({ok:true,categoria})

}

const obtenerCategorias=async(req,res=response)=>{
    
    const {limite=5,desde=0}=req.query


    const [total,categorias]=await Promise.all([//promise.all es para ejecutar acciones de manera simultanea
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true})
            .skip(Number(desde))
            .limit(Number(limite))

    ]);
    
    res.json({ok:true,total,categorias})

}

const obtenerCategoria=async(req,res=response)=>{

    const {id}=req.params
    const categoria=await Categoria.findById(id)

    res.json(categoria)

}

const actualizarCategoria=async(req,res=response)=>{
    const {id}=req.params;

    const {estado,usuario,...data}=req.body;

    data.nombre=data.nombre.toUpperCase();

    data.usuario=req.usuario._id//id del usuario dueño del token

    const categoriaActualizada=await Categoria.findByIdAndUpdate(id,data,{new:true})

    res.json(categoriaActualizada)

}

const borrarCategoria=async(req,res=response)=>{
    const {id}=req.params;


    const categoriaBorrada=await Categoria.findByIdAndUpdate(id,{estado:false},{new:true})

    res.json(categoriaBorrada)

}



module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}