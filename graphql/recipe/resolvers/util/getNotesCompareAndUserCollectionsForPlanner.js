"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memberModel_1 = __importDefault(require("../../../../models/memberModel"));
const Compare_1 = __importDefault(require("../../../../models/Compare"));
const userNote_1 = __importDefault(require("../../../../models/userNote"));
/**
 * Retrieves notes, compares, and user collections for a given user.
 *
 * @param {String} userId - The ID of the user.
 * @param {any[]} userProfileRecipes - An array of user profile recipes.
 * @return {any[]} An array of return recipes.
 */
async function getNotesCompareAndUserCollection(userId, userProfileRecipes) {
    let returnRecipe = [];
    let collectionRecipes = [];
    let member = await memberModel_1.default.findOne({ _id: userId })
        .populate({
        path: 'collections',
        model: 'UserCollection',
        select: 'recipes',
    })
        .select('-_id collections');
    // console.log(member.collections);
    for (let i = 0; i < member.collections.length; i++) {
        //@ts-ignore
        let items = member.collections[i].recipes.map(
        //@ts-ignore
        (recipe) => {
            return {
                recipeId: String(recipe),
                recipeCollection: String(member.collections[i]._id),
            };
        });
        collectionRecipes.push(...items);
    }
    for (let i = 0; i < userProfileRecipes.length; i++) {
        let userNotes = await userNote_1.default.find({
            recipeId: userProfileRecipes[i].recipeId._id,
            userId: userId,
        }).select('_id');
        let addedToCompare = false;
        // console.log(userProfileRecipes[i].recipeId._id);
        let compare = await Compare_1.default.findOne({
            userId: userId,
            recipeId: userProfileRecipes[i].recipeId._id,
        }).select('_id');
        if (compare) {
            addedToCompare = true;
        }
        let collectionData = collectionRecipes.filter((recipeData) => String(recipeData.recipeId) ===
            String(userProfileRecipes[i].recipeId._id));
        if (collectionData.length === 0) {
            collectionData = null;
        }
        else {
            //@ts-ignore
            collectionData = collectionData.map((data) => data.recipeCollection);
        }
        let versionsCount = 0;
        versionsCount +=
            +userProfileRecipes[i].turnedOnVersions.length +
                +userProfileRecipes[i].turnedOffVersions.length;
        if (!userProfileRecipes[i].isMatch) {
            versionsCount++;
        }
        if (userProfileRecipes[i].compare) {
            returnRecipe.push({
                ...userProfileRecipes[i],
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
                versionCount: versionsCount,
            });
        }
        else {
            returnRecipe.push({
                ...userProfileRecipes[i],
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
                versionCount: versionsCount,
            });
        }
    }
    // console.log(returnRecipe[0]);
    return returnRecipe;
}
exports.default = getNotesCompareAndUserCollection;
