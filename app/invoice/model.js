const mongoose = require('mongoose')
const { model, Schema } = mongoose

const invoiceSchema = Schema({

    sub_total:{
        type: Number,
        required: [true, 'sub total harus di isi']
    },
    delivery_fee:{
        type: Number,
        require: [true, 'delivery fee harus di isi']
    },
    delivery_address:{
        provinsi: {
            type: String,
            require: [true, 'provinsi harus di isi'],
        },
        kabupaten:{
            type: String,
            require: [true, 'kabupaten harus di isi'],
        },
        kecamatan:{
            type: String,
            require: [true, 'kecamatan harus di isi'],
        },
        kelurahan: {
            type: String,
            require: [true, 'kelurahan harus di isi'],
        },
        detail: {
            type: String,
            require: [true, 'detail harus di isii'],
        }
    },
    total:{
        type: Number,
        require: [true, 'total harus di isi'],
    },
    payment_status: {
        type: String,
        enum: ['waiting_payment','paid'],
        default: 'waiting_payment'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
    }
}, {timestamps: true})

module.exports = model('Invoice', invoiceSchema)
