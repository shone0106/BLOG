"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postsSchema = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    authorName: { type: String, required: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Post', postsSchema);
