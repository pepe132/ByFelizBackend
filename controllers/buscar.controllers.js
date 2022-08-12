const { response } = require("express");
const {ObjectId}=require('mongoose').Types

const Producto = require("../models/producto");

const buscarProductos=async(req,res=response)=>{

    const {termino}=req.params

    const {limite=8,pagina=1}=req.query

    const esMongoId=ObjectId.isValid(termino)

    if (esMongoId){
        const producto=await Producto.findById(termino)
        return res.json({
            results:(producto) ? [producto] : []
        })  
    }

    const regex=new RegExp(termino,'i');

    const [total,productos]=await Promise.all([
        Producto.countDocuments({nombre:regex}),
        Producto.find({ nombre: regex })
        .limit(Number(limite*1))
        .skip((Number(pagina-1))*limite)
    ])

    //const productos=await Producto.find({ nombre: regex }, { precio: 0 })

    res.json({
        ok:true,
        total,
        results:productos
    })

}

module.exports={buscarProductos}