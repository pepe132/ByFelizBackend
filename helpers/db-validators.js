
const Role = require('../models/role');

const Usuario=require('../models/usuario');

const Categoria=require('../models/categoria');
const Producto = require('../models/producto');

const esRoleValido=async(rol='')=>{
    const existeRol=await Role.findOne({rol});
    if (!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la base de datos`)
        
    }

}

const existeEmail=async(correo='')=>{
    const miEmail=await Usuario.findOne({correo})
    if (miEmail) {
        throw new Error(`El correo: ${correo} ya esta registrado`);
    }   
}

const existeUsuarioPorId=async(id)=>{
    const existeUsuario=await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id no existe: ${id}`);
    }   
}

//validadores de categorias

const existeCategoriaPorId=async(id)=>{
    const existeCategoria=await Categoria.findById(id)
    if (!existeCategoria) {
        throw new Error(`El id no existe: ${id}`);
    }   
}

const existeProductoPorId=async(id)=>{
    const existeProducto=await Producto.findById(id)
    if (!existeProducto) {
        throw new Error(`El id no existe: ${id}`);
    }   
}


module.exports={
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}