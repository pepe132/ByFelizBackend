
const {Router}=require('express');
const {  buscarProductos } = require('../controllers/buscar.controllers');

const router=Router();

router.get('/search/:termino',buscarProductos)

module.exports=router