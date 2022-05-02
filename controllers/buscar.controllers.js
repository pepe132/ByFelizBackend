const { response } = require("express");
const {ObjectId}=require('mongoose').Types

const Categoria = require("../models/categoria");
const Producto = require("../models/producto");

const coleccionesPermitidas=[
    'categorias',
    'productos',
    'productosCategorias'
]

const buscarCategorias=async(termino='',res=response)=>{

    const esMongoId=ObjectId.isValid(termino)

    if (esMongoId){
        const categoria=await Categoria.findById(termino)
        return res.json({
            results:(categoria) ? [categoria] : []
        })  
    }

    const regex=new RegExp(termino,'i');
    const categorias=await Categoria.find({nombre:regex,estado:true})

    res.json({
        results:categorias
    })

}

const buscarProductos=async(termino='',res=response)=>{

    const esMongoId=ObjectId.isValid(termino)

    if (esMongoId){
        const producto=await Producto.findById(termino)
        return res.json({
            results:(producto) ? [producto] : []
        })  
    }

    const regex=new RegExp(termino,'i');

    const productos=await Producto.find({ nombre: regex }, { precio: 0 })

    res.json({
        results:productos
    })

}
const buscarProductosPorCategoria=async(termino='',res=response)=>{
    const esMongoId=ObjectId.isValid(termino)

    if (esMongoId){
        const categoria=await Categoria.findById(termino)
        return res.json({
            results:(categoria) ? [categoria] : []
        })  
    }

    const regex=new RegExp(termino,'i');

    const categoria=await Categoria.findOne({
        nombre:regex,
        estado:true
    })

    const productos=await Producto.find({
        estado:true,
        $and:[{
            categoria:categoria._id
        }]
    }).populate('categoria','nombre');

    res.json({
        results:productos
    })
}



const buscar=(req,res=response)=>{
    const {coleccion,termino}=req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg:`las colecciiones permitididas son: ${coleccionesPermitidas}`
        })  
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino,res)
            break;
        case 'productos':
            buscarProductos(termino,res)
            break;
        case 'productosCategorias':
            buscarProductosPorCategoria(termino,res)
            break;
    
        default:
            res.status(500).json({
                msg:'Se me olvido hacer esta busqueda'
            })
    }
}

module.exports={buscar}