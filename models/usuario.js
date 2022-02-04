
const {Schema,model}=require('mongoose');

const UsuarioSchema=Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio']
    },
    correo:{
        type:String,
        required:[true,'El correo es obligatorio'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'La contraseña es obligatoria']
    },
    img:{
        type:String,
    },
    rol:{
        type:String,
        required:true,
        emun:['ADMIN_ROLE','USER_ROLE']
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }

})

//IMOORTANTE: aqui es donde se va a mostrar que argumentos va a llegar la respuesta 

UsuarioSchema.methods.toJSON=function () {
    const {__v,password,...usuario}=this.toObject()//estoy sacando la version y el password de la respuesta y tofos lod demas se almacenan

    return usuario
    
}



module.exports=model('Usuario',UsuarioSchema);