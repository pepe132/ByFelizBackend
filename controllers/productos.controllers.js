const { response } = require("express");
const Producto = require("../models/producto");

const crearProducto=async(req,res=response)=>{

    const {estado,usuario, ...body}=req.body;

    const nombre = body.nombre.toUpperCase();


    const productoDB=await Producto.findOne({nombre});

    if (productoDB) {//si categoria db no es nula
        res.status(400).json({
            msg:`El producto ${productoDB.nombre} ya existe`
        }) 
    }

    //generar la data a guardar

    const data={
        ...body,
        nombre:body.nombre,
        usuario:req.usuario._id//asi es como mongo graba el id
    }

    const producto= new Producto(data);

    //guardar db

    await producto.save();

    res.status(201).json({ok:true,producto})

}

const reviewProducto=async(req,res=response)=>{
    const {id}=req.params
    const { rating, comment } = req.body
    const producto=await Producto.findById(id)

    if (producto) {
        const review = {
            name: req.usuario.nombre,
            rating: Number(rating),
            comment,
            user: req.usuario._id,
        }

        producto.reviews.push(review)

        producto.numReviews = producto.reviews.length

        producto.rating =
        producto.reviews.reduce((acc, item) => item.rating + acc, 0) /
        producto.reviews.length

        const completo=await producto.save()
        res.status(201).json({ok:true, message: 'Review added' ,completo})
        
    } else {
        res.status(404).json({
            msg:'producto no encontrado'
        })
    }
}

const obtenerProductos=async(req,res=response)=>{
    
    const {limite=5,pagina=1}=req.query


    const [total,productos]=await Promise.all([//promise.all es para ejecutar acciones de manera simultanea
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .limit(Number(limite*1))
            .skip((Number(pagina-1))*limite)
    ]);
    console.log(productos);
    
    res.json({ok:true,total,productos})

}

const obtenerProductosMDF=async(req,res=response)=>{
    const {limite=8,pagina=1}=req.query
    const [total,productos]=await Promise.all([//promise.all es para ejecutar acciones de manera simultanea
        Producto.countDocuments({estado:true,categoria:'624cb6af3565e7cb1dc666c1'}),
        Producto.find({estado:true,categoria:'624cb6af3565e7cb1dc666c1'})
            .populate('categoria','nombre')
            .limit(Number(limite*1))
            .skip((Number(pagina-1))*limite)

    ]);
    
    res.json({ok:true,total,productos})

}

const obtenerProductosVinil=async(req,res=response)=>{
    const {limite=8,pagina=1}=req.query

    const [total,productos]=await Promise.all([//promise.all es para ejecutar acciones de manera simultanea
        Producto.countDocuments({estado:true,categoria:'62674c5af1a930bd5b71b847'}),
        Producto.find({estado:true,categoria:'62674c5af1a930bd5b71b847'})
            .populate('categoria','nombre')
            .limit(Number(limite*1))
            .skip((Number(pagina-1))*limite)

    ]);
    
    res.json({ok:true,total,productos})

}

const obtenerCajasPersonalizadas=async(req,res=response)=>{

    const {limite=8,pagina=1}=req.query

    const [total,productos]=await Promise.all([//promise.all es para ejecutar acciones de manera simultanea
        Producto.countDocuments({estado:true,categoria:'6269be907b846abc305c18a2'}),
        Producto.find({estado:true,categoria:'6269be907b846abc305c18a2'})
            .populate('categoria','nombre')
            .limit(Number(limite*1))
            .skip((Number(pagina-1))*limite)

    ]);
    
    
    res.json({ok:true,total,productos})

}


const obtenerProducto=async(req,res=response)=>{

    const {id}=req.params
    const producto=await Producto.findById(id)

    res.json({ok:true,producto})

}

const actualizarProducto=async(req,res=response)=>{
    const {id}=req.params;

    const {estado,usuario,...data}=req.body;

    if (data.nombre) {
        data.nombre=data.nombre.toUpperCase();
    }


    data.usuario=req.usuario._id//id del usuario dueño del token

    const productoActualizado=await Producto.findByIdAndUpdate(id,data,{new:true})

    res.json(productoActualizado)

}

const borrarProducto=async(req,res=response)=>{
    const {id}=req.params;

    const productoBorrado=await Producto.findByIdAndUpdate(id,{estado:false},{new:true})

    res.json(productoBorrado)

}



module.exports={
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
    obtenerProductosMDF,
    obtenerProductosVinil,
    obtenerCajasPersonalizadas,
    reviewProducto
}