const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps:{
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    }
);

module.exports = model("User", userSchema);
