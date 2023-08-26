"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// recipeId
// userId
// verid
// on
const userRecipeProfileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    recipeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'RecipeModel',
    },
    turnedOnVersions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'RecipeVersion',
        },
    ],
    turnedOffVersions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'RecipeVersion',
        },
    ],
    defaultVersion: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'RecipeVersion',
    },
    isMatch: Boolean,
    allRecipes: Boolean,
    myRecipes: Boolean,
    tags: [String],
    lastSeen: { type: Date, default: Date.now },
    personalRating: { type: Number, default: 0 },
});
const UserRecipeProfile = (0, mongoose_1.model)('UserRecipeProfile', userRecipeProfileSchema);
exports.default = UserRecipeProfile;
