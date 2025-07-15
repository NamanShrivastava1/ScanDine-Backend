const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema({
    cafename: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    qrCode: {
        type: String, // because it's a base64 image
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
})

const cafe = mongoose.model("cafe", cafeSchema, "cafes");
module.exports = cafe;