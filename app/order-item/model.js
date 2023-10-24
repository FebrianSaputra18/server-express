const mongoose = require('mongoose');
const { model, Schema } = mongoose

const orderItemSchema = Schema({
    name:{
        type: String,
        minLength: [5, 'Panjang nama makanan minimal 50 karakter'],
        required: [true, 'name must be filled']
    },
    price:{
        type: String,
        required: [true, 'Harga harus di isi'],
    },
    qty:{
        type: Number,
        required: [true, 'Kuantitas harus di isi'],
        min: [1,'Kuantitas minimal 1']
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }
})

module.exports = model('OrderItem', orderItemSchema)