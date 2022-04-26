const {Router}=require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controllers');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');
const { esAdminRole } = require('../middlewares/validar-roles');

const router=Router();

//Obtener todas las categorias-publico
router.get('/',obtenerCategorias)

//Obtener una categoria por id-publico

router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria)

//Crear categoria- solo admins-privado con token valido

router.post('/nueva-categoria',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria)

//Actualizar categoria-solo admins-privado con token valido

router.put('/actualizar-categoria/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria)

//borrar una categoria-admin
router.delete('/eliminar-categoria/:id',[
    //esAdminRole
    validarJWT,
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
    
],borrarCategoria)

module.exports=router;