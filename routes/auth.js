const {Router}=require('express');
const { check } = require('express-validator');
const { login, revalidarToken, googleSingIn } = require('../controllers/auth.controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');

const router=Router();

router.post('/login',[
    check('correo','El correo es obligatorio').isEmail(),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login)

router.get('/renew', validarJWT ,revalidarToken );

router.post('/google',[
    check('id_token','Token de Google es necesario').not().isEmpty(),
    validarCampos
],googleSingIn)

module.exports=router