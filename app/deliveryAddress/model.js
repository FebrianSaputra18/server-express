const {Schema, model} = require('mongoose')

const deliveryAddress = Schema({

    nama: {
        type: String,
        require: [true, 'Nama harus di isi'],
        maxLength: [255, 'panjang maksimal nama alamat adalah 255 characters']
    },
    kelurahan: {
        type: String,
        require: [true, 'Kelurahan harus di isi'],
        maxLength: [255, 'panjang maksimal nama kelurahan adalah 255 characters']
    },
    kecamatan: {
        type: String,
        require: [true, 'Kecamatan harus di isi'],
        maxLength: [255, 'panjang maksimal nama kecamatan adalah 255 characters']
    },
    kabupaten: {
        type: String,
        require: [true, 'Kabupaten harus di isi'],
        maxLength: [255, 'panjang maksimal nama kabupaten adalah 255 characters']
    },
    provinsi: {
        type: String,
        require: [true, 'Provinsi harus di isi'],
        maxLength: [255, 'panjang maksimal nama Provinsi adalah 255 characters']
    },
    detail: {
        type: String,
        require: [true, 'Detail harus di isi'],
        maxLength: [255, 'panjang maksimal Detail adalah 255 characters']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {timestamps: true})

module.exports = model('DeliveryAddress', deliveryAddress);