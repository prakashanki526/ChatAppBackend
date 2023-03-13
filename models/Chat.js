const mongoose = require("mongoose");
const {model, Schema} = mongoose;

const chatSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        messages: {
            type: Array
        }
    },
    {
        timestamps:{
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    }
);

module.exports = model("Chat", chatSchema);
