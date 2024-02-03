const mongoose = require('mongoose');


const MediaSchema = new mongoose.Schema(
    {
        title: { type: String, require: true, trim: true },
        mediaName: { type: String, require: true, trim: true },
        mediaPath: { type: String, require: true, trim: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("MediaInfo", MediaSchema);