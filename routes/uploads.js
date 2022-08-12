const {Router}=require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, subirCatalogo, editarCatalogo, editarImagenCatalogo } = require('../controllers/uploads.controllers');
const { coleccionesPermitidas } = require('../helpers/db-validators');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router=Router();

router.post('/subir',validarArchivoSubir,cargarArchivo)

router.put('/actualizar/:coleccion/:id',[
    validarJWT,
    validarArchivoSubir,
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],actualizarImagen)

router.get('/:coleccion/:id',[
    check('id','El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImagen)

router.post('/subir-imagenes/:id',[
    validarJWT,
    validarArchivoSubir,
    check('id','El id debe ser de Mongo').isMongoId(),
    validarCampos
],subirCatalogo)

router.put('/editar-imagenes/:id/:id_imagen',[
    validarJWT,
    check('id','El id debe ser de Mongo').isMongoId(),
    validarCampos
],editarCatalogo)




module.exports=router