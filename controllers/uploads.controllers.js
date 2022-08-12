const { response } = require("express");
const path=require('path');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { subirArchivo } = require("../helpers/subir-archivo");

const Producto = require("../models/producto");
const Usuario = require("../models/usuario");

const cargarArchivo=async(req,res=response)=>{

  try {
    const nombre=await subirArchivo(req.files,undefined,'imgs');
  
    res.json({nombre})
    
  } catch (msg) {

    res.status(400).json({msg})
    
  }      
}

const actualizarImagen=async(req,res=response)=>{

  const {id,coleccion}=req.params

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo=await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg:'No existe un usuario con este id '
        })
      }

    break;

    case 'productos':
      modelo=await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg:'No existe un producto con este id '
        })
      }
    break;
  
    default:
      return res.status(500).json({msg:'Se me olvido hacer esto'});
  }

  //Limpiar imagenes previas

  if (modelo.img) {
    const nombreArr=modelo.img.split('/');
    const nombre=nombreArr[nombreArr.length-1];
    const [public_id]=nombre.split('.')

    cloudinary.uploader.destroy(public_id)
    
  }

  const {tempFilePath}=req.files.archivo

  const {secure_url}=await cloudinary.uploader.upload(tempFilePath)

  modelo.img=secure_url

  await modelo.save()

  res.json(modelo)

}

const mostrarImagen=async(req,res=response)=>{

  const {id,coleccion}=req.params

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo=await Usuario.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg:'no existe un usuario con ese id'
        })
      }

      break;

    case 'productos':
      modelo=await Producto.findById(id)
      if (!modelo) {
        return res.status(400).json({
          msg:'No existe un producto con este id '
        })
      }
      break;
  
    default:
      return res.status(500).json({msg:'Se me olvido hacer esto'});
  }


  if (modelo.img) {
    //hay que borrar la imagen del servidor
      return res.json({
        img:modelo.img
      })

    }else{
      const pathImagen=path.join(__dirname,'../assets/no-image.jpg')
      return res.sendFile(pathImagen)

    }
    
}

const subirCatalogo=async(req,res=response)=>{

  const {id}=req.params
  const {alt}=req.body

 
    let modelo=await Producto.findById(id)
    if (!modelo) {
      return res.status(400).json({
        msg:'No existe un producto con este id '
      })
    }
  

  const {tempFilePath}=req.files.archivo

  const {secure_url}=await cloudinary.uploader.upload(tempFilePath)

  modelo.images.push({src:secure_url,alt:alt})

  await modelo.save()

  res.json(modelo)

}

const editarCatalogo=async(req,res=response)=>{

  //id es el id del producto
  //id_imagen es el id del producto en el array

  const {id,id_imagen}=req.params
  const {alt}=req.body

 
    let modelo=await Producto.findById(id)
    if (!modelo) {
      return res.status(400).json({
        msg:'No existe un producto con este id '
      })
    }

    const altActualizado=await Producto.updateOne(
      {"images._id":id_imagen},{$set:{"images.$.alt":alt}},
    )

    res.json(altActualizado)

}


module.exports={
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    subirCatalogo,
    editarCatalogo
}