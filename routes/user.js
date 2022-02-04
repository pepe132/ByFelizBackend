
const {Router}=require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/user.controllers');
const { esRoleValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos')

const router=Router();

router.get('/',usuariosGet)

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña debe ser de mas de 6 letras').isLength({min:6}),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(existeEmail),
    //check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos//esta es la que va a ejecutar los demas errores de los demas middlewares
    
],usuariosPost)

router.put('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosPut)

router.delete('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos

],usuariosDelete)

module.exports=router