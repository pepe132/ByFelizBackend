const {Schema,model}=require('mongoose');

const reviewSchema=Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario',
    },
})

const ImageSchema=Schema({
    src:{type:String},
    alt:{type:String},
})



const ProductoSchema=Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio']
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
    },
    precio:{
        type:Number,
        default:0
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true
    },
    descripcion:{type:String},
    disponible:{type:Boolean,default:true},
    img:{type:String,default:null},
    medidas:{type:String},
    adicional:{type:String},
    reviews:[reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
    type: Number,
    required: true,
    default: 0,
    },
    images:[ImageSchema]
})

ProductoSchema.methods.toJSON=function () {
    const {__v,estado,...producto}=this.toObject()//estoy sacando la version y el password de la respuesta y tofos lod demas se almacenan

    return producto
    
}

module.exports=model('Producto',ProductoSchema)