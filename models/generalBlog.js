"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GeneraBlogSchema = new mongoose_1.Schema({
    title: String,
    slug: { type: String, unique: true },
    body: { type: String, default: '' },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    keywords: { type: [String], default: [] },
    type: String,
    updatedAt: Date,
    category: String,
    description: String,
    coverImage: String,
    mediaUrl: String,
    mediaLength: Number,
    isPublished: Boolean,
    publishDate: Date,
    createdBy: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'Admin' },
    collections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminCollection',
        },
    ],
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeBrand' },
    bookmarkList: [
        {
            customBookmarkName: String,
            link: { type: String, default: '' },
            active: { type: mongoose_1.Schema.Types.Boolean, default: false },
        },
    ],
});
const GeneralBlog = (0, mongoose_1.model)('GeneraBlog', GeneraBlogSchema);
exports.default = GeneralBlog;
// category
// description
// coverImage
// mediaUrl
// isPublished
// publishDate
