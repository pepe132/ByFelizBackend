
const {Schema,model}=require('mongoose');

const CategoriaSchema=Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',//coleccion a la que apunta
        required:true
    }
})

//IMOORTANTE: aqui es donde se va a mostrar que argumentos va a llegar la respuesta 

CategoriaSchema.methods.toJSON=function () {
    const {__v,estado,...categoria}=this.toObject()//estoy sacando la version y el password de la respuesta y tofos lod demas se almacenan

    return categoria
    
}


module.exports=model('Categoria',CategoriaSchema)