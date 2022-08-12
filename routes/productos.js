const { Router } = require("express");
const { check } = require('express-validator');
const { obtenerProductos, obtenerProducto, crearProducto, actualizarProducto, borrarProducto, obtenerProductosMDF, obtenerProductosVinil, obtenerCajasPersonalizadas, actualizarProductoValoracion, reviewProducto } = require("../controllers/productos.controllers");
const { existeProductoPorId, existeCategoriaPorId } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-JWT");

const router=Router();

//Obtener todas los productos
router.get('/todos',obtenerProductos)

//Obtener todas los productos de MDF
router.get('/todos-MDF',obtenerProductosMDF)

//Obtener todas los productos de Vinilo
router.get('/todos-vinil',obtenerProductosVinil)

//Obtener todas los productos de cajas
router.get('/todos-cajas',obtenerCajasPersonalizadas)

//Obtener un producto por id

router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto)

//Crear producto- solo admins-privado con token valido

router.post('/nuevo-producto',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],crearProducto)

//Actualizar categoria-solo admins-privado con token valido

router.put('/actualizar-producto/:id',[
    validarJWT,
    //check('categoria','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto)

//REVIEW PRODUCTO

router.post('/nueva_valoracion/:id',[
    validarJWT,
    //check('categoria','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],reviewProducto)

//borrar una categoria-admin
router.delete('/eliminar-producto/:id',[
    //esAdminRole
    validarJWT,
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
    
],borrarProducto)

module.exports=router;