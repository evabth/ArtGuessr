const mongoose = require("mongoose")


const gameStateSchema = mongoose.Schema({
    score : {
        type: Number,
        required: true,
    },
    round: {
        type: Number,
        required: true,
    },
    currPaintingYear: {
        type: Number,
        required: true,
    },
    currArtID: {
        type: String,
    },
    bestPaintingId: {
        type: String,
    },
    bestPaintingURL: {
        type:String,
    },
    worstPaintingID: {
        type: String,
    },
    worstPaintingURL: {
        type: String,
    },

},
{
    timestamps:true,
})

module.exports = mongoose.model("GameState", gameStateSchema)