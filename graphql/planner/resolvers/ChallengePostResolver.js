"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const CreateChallengePost_1 = __importDefault(require("./input-type/CreateChallengePost"));
const IngredientData_1 = __importDefault(require("../../recipe/schemas/IngredientData"));
const ChallengePost_1 = __importDefault(require("../schemas/ChallengePost"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const ChallengePost_2 = __importDefault(require("../../../models/ChallengePost"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const challenge_1 = __importDefault(require("../../../models/challenge"));
const shareChallengeGlobal_1 = __importDefault(require("../../../models/shareChallengeGlobal"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const Challenge_1 = __importDefault(require("../schemas/Challenge"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const ChallengeAndChallengeDocs_1 = __importDefault(require("../schemas/ChallengeAndChallengeDocs"));
const GalleryImage_1 = __importDefault(require("../schemas/GalleryImage"));
const FormateDate_1 = __importDefault(require("../../../utils/FormateDate"));
const recipeCategory_1 = __importDefault(require("../../../models/recipeCategory"));
const EditChallengePost_1 = __importDefault(require("./input-type/EditChallengePost"));
const ChallengePostWithCount_1 = __importDefault(require("../schemas/ChallengePostWithCount"));
const IngredientStatsWithPortion_1 = __importDefault(require("../schemas/IngredientStatsWithPortion"));
const BlendNutrientStats_1 = __importDefault(require("../schemas/BlendNutrientStats"));
const OrganizeByTypes_1 = __importDefault(require("../../../utils/OrganizeByTypes"));
const OrganizeByTypesForNutrition_1 = __importDefault(require("../../../utils/OrganizeByTypesForNutrition"));
const GetDailyRecomendedAndUpperLimit_1 = __importDefault(require("../../../utils/GetDailyRecomendedAndUpperLimit"));
const InviteForChallenge_1 = __importDefault(require("../../../models/InviteForChallenge"));
const ChsllengeAndSingleDoc_1 = __importDefault(require("../schemas/ChsllengeAndSingleDoc"));
const DateDocPostId_1 = __importDefault(require("../schemas/DateDocPostId"));
const ChallngeInfo_1 = __importDefault(require("../schemas/ChallngeInfo"));
const InviteInfoSharedWithAndTopIngredients_1 = __importDefault(require("../schemas/InviteInfoSharedWithAndTopIngredients"));
let ChallengePostResolver = class ChallengePostResolver {
    /**
     * Asynchronously inserts data into the database.
     *
     * @return {Promise<string>} A promise that resolves with the string 'done' when the data is successfully inserted.
     */
    async ins() {
        await InviteForChallenge_1.default.deleteMany();
        return 'done';
    }
    /**
     * Updates challenge 889.
     *
     * @return {Promise<string>} A string indicating the completion of the update.
     */
    async updateChallenge889() {
        await ChallengePost_2.default.deleteMany({});
        return 'done';
    }
    /**
     * Retrieves the ingredients from a recipe.
     *
     * @param {string} recipeId - The ID of the recipe.
     * @return {Promise<Array>} The list of ingredients.
     */
    async getIngredientsFromARecipe(recipeId) {
        let recipe = await recipeModel_1.default.findOne({ _id: recipeId }).populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
                select: 'ingredientName',
            },
        });
        //@ts-ignore
        return recipe.defaultVersion.ingredients;
    }
    /**
     * Adds a unique object to the given array.
     *
     * @param {any[]} array - The array to add the object to.
     * @param {any} data - The object to add.
     * @return {any[]} The updated array.
     */
    async addUniqueObj(array, data) {
        let index = -1;
        for (let i = 0; i < array.length; i++) {
            if (array[i].url === data.url) {
                index = i;
            }
        }
        if (index > -1) {
            array[index] = data;
        }
        else {
            array.push(data);
        }
        return array;
    }
    /**
     * Create a challenge post.
     *
     * @param {CreateChallengePost} data - the data for creating a challenge post
     * @return {Promise} a Promise that resolves to an object containing the created challenge post and related information
     */
    async createChallengePost(data) {
        if (!data.memberId || !data.assignDate) {
            return new AppError_1.default('Please provide memberId and assignDate', 400);
        }
        let isoDate = new Date(data.assignDate).toISOString();
        let blendCategory = await recipeCategory_1.default.findOne({
            _id: data.post.recipeBlendCategory,
        }).select('name');
        let post = data.post;
        if (data.post.name === '' || data.post.name === undefined) {
            post.name = blendCategory.name + ' ' + data.assignDate;
        }
        for (let i = 0; i < data.post.ingredients.length; i++) {
            post.ingredients[i].portions = [];
            let ingredient = await blendIngredient_1.default.findOne({
                _id: post.ingredients[i].ingredientId,
            });
            let index = 0;
            let selectedPortionIndex = 0;
            for (let j = 0; j < ingredient.portions.length; j++) {
                if (ingredient.portions[j].default === true) {
                    index = j;
                    break;
                }
            }
            for (let k = 0; k < ingredient.portions.length; k++) {
                if (ingredient.portions[k].measurement ===
                    post.ingredients[i].selectedPortionName) {
                    selectedPortionIndex = k;
                }
                let portion = {
                    name: ingredient.portions[k].measurement,
                    quantity: post.ingredients[i].weightInGram /
                        +ingredient.portions[k].meausermentWeight,
                    default: ingredient.portions[k].default,
                    gram: ingredient.portions[k].meausermentWeight,
                };
                post.ingredients[i].portions.push(portion);
            }
            post.ingredients[i].selectedPortion = {
                name: ingredient.portions[selectedPortionIndex].measurement,
                quantity: post.ingredients[i].weightInGram /
                    +ingredient.portions[selectedPortionIndex].meausermentWeight,
                gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
            };
        }
        let challengePostDoc = await ChallengePost_2.default.findOne({
            memberId: data.memberId,
            assignDate: isoDate,
        });
        if (challengePostDoc) {
            let images = [];
            for (let i = 0; i < data.post.images.length; i++) {
                images = await this.addUniqueObj(challengePostDoc.images, data.post.images[i]);
            }
            await ChallengePost_2.default.findOneAndUpdate({
                _id: challengePostDoc._id,
            }, {
                $push: { posts: post },
                images: images,
            }, {
                new: true,
            });
        }
        else {
            await ChallengePost_2.default.create({
                memberId: data.memberId,
                assignDate: isoDate,
                images: data.post.images,
                posts: [post],
                date: data.assignDate,
            });
        }
        let challenge = await challenge_1.default.findOne({
            memberId: data.memberId,
            isActive: true,
        });
        // let tempDay = new Date(new Date().toISOString().slice(0, 10));
        // if (challenge.days > 30) {
        //   if (challenge.startDate <= tempDay && challenge.endDate >= tempDay) {
        //     //@ts-ignore
        //     let diffTime = Math.abs(tempDay - challenge.startDate);
        //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        //     if (diffDays >= 30) {
        //       let StartCount = Math.abs(diffDays - 30) + 1;
        //       let day = challenge.startDate;
        //       tempDay = new Date(day.setDate(day.getDate() + StartCount));
        //     } else {
        //       tempDay = challenge.startDate;
        //     }
        //     console.log('a', tempDay);
        //   } else {
        //     let day = challenge.endDate;
        //     tempDay = new Date(day.setDate(day.getDate() - 30));
        //     console.log('b', tempDay);
        //   }
        // } else {
        //   tempDay = challenge.startDate;
        //   console.log('c', tempDay);
        // }
        // console.log(data.memberId);
        // console.log(tempDay);
        let challengeDoc = await ChallengePost_2.default.findOne({
            memberId: data.memberId,
            assignDate: isoDate,
        })
            .populate('posts.recipeBlendCategory')
            .populate('posts.ingredients.ingredientId');
        let doc = {
            _id: challengeDoc._id,
            images: challengeDoc.images,
            assignDate: challengeDoc.assignDate,
            date: new Date(challengeDoc.assignDate).getDate(),
            dayName: new Date(challengeDoc.assignDate).toLocaleString('default', {
                weekday: 'short',
            }),
            formattedDate: (0, FormateDate_1.default)(challengeDoc.assignDate),
            posts: challengeDoc.posts,
        };
        let challengeInfo = await this.getChallengeInfo(data.memberId, false, '', String(challenge._id));
        return { challenge: doc, challengeInfo: challengeInfo };
    }
    /**
     * Invites a user to a challenge.
     *
     * @param {String} challengeId - The ID of the challenge.
     * @param {String} invitedBy - The ID of the user who is inviting.
     * @param {[String]} invitedWith - An array of user IDs who are invited.
     * @param {Boolean} canInviteWithOthers - Whether the user can invite others.
     * @param {string} currentDate - The current date (optional).
     * @return {String} - The ID of the created invite challenge.
     */
    async inviteToChallenge(challengeId, invitedBy, invitedWith, canInviteWithOthers, currentDate) {
        let ISOCurrentDate = new Date(currentDate);
        let challenge = await challenge_1.default.findOne({ _id: challengeId });
        if (currentDate) {
            if (challenge.startDate.valueOf() < ISOCurrentDate.valueOf()) {
                return new AppError_1.default('Challenge has already started', 400);
            }
        }
        else {
            if (challenge.startDate.valueOf() < new Date().valueOf()) {
                return new AppError_1.default('Challenge has already started', 400);
            }
        }
        if (!challenge) {
            return new AppError_1.default('no challenge found', 403);
        }
        if (String(challenge.memberId) !== invitedBy) {
            return new AppError_1.default('You are not the owner of this challenge', 400);
        }
        let invite = await InviteForChallenge_1.default.findOne({ challengeId });
        let members = [];
        if (!invite) {
            for (let i = 0; i < invitedWith.length; i++) {
                let member = await memberModel_1.default.findOne({
                    email: invitedWith[i],
                }).select('_id');
                if (String(member._id) === String(challenge.memberId)) {
                    continue;
                }
                members.push({
                    memberId: member._id,
                    hasAccepted: false,
                });
            }
            let myStats = await this.getChallengeInfo(invitedBy, false, '', challengeId);
            await challenge_1.default.findOneAndUpdate({
                _id: challengeId,
            }, {
                $push: {
                    sharedWith: {
                        memberId: invitedBy,
                        canInviteWithOthers: true,
                        blendScore: Math.round(myStats.blendScore),
                        hasAccepted: true,
                    },
                },
            });
            // await this.upgradeTopIngredient(challengeId);
            let inviteChallenge = await InviteForChallenge_1.default.create({
                challengeId: challengeId,
                invitedBy: invitedBy,
                invitedWith: members,
            });
            return inviteChallenge._id;
        }
        else {
            for (let i = 0; i < invitedWith.length; i++) {
                let member = await memberModel_1.default.findOne({
                    email: invitedWith[i],
                }).select('_id');
                if (String(member._id) === String(challenge.memberId)) {
                    continue;
                }
                let data = invite.invitedWith.filter((inv) => String(inv.memberId) === String(member._id))[0];
                if (!data) {
                    await InviteForChallenge_1.default.findOneAndUpdate({
                        _id: invite._id,
                    }, {
                        $push: {
                            invitedWith: {
                                memberId: member._id,
                                hasAccepted: false,
                                canInviteWithOthers: canInviteWithOthers,
                            },
                        },
                    });
                }
            }
            return invite._id;
        }
    }
    /**
     * Retrieves information about an invite challenge.
     *
     * @param {String} inviteId - The ID of the invite.
     * @param {String} memberId - The ID of the member. (optional)
     * @return {Object} An object containing the invite, sharedWith, topIngredients, isOwner, hasAccepted, and hasInvited.
     */
    async getInviteChallengeInfo(inviteId, memberId) {
        let isOwner = '';
        let hasAccepted = '';
        let hasInvited = '';
        let invite = await InviteForChallenge_1.default.findOne({ _id: inviteId })
            .populate({
            path: 'challengeId',
            select: 'challengeName',
        })
            .populate({
            path: 'invitedBy',
            select: 'firstName lastName image displayName email',
        });
        if (memberId) {
            if (invite.invitedWith.filter((iw) => String(iw.memberId) === memberId)[0]) {
                isOwner = false;
                hasInvited = true;
                hasAccepted = false;
            }
        }
        // console.log(invite);
        if (!invite.challengeId) {
            return new AppError_1.default('challenge not found', 402);
        }
        let challenge = await challenge_1.default.findOne({
            _id: invite.challengeId._id,
        }, { topIngredients: { $slice: 5 } })
            .populate({
            path: 'sharedWith.memberId',
            select: 'image displayName fistName lastName email',
        })
            .sort({ blendScore: -1 })
            .populate({
            path: 'topIngredients.ingredientId',
            select: 'ingredientName featuredImage',
        });
        if (memberId) {
            if (String(challenge.memberId) === memberId) {
                isOwner = true;
                hasAccepted = true;
                hasInvited = true;
            }
            else if (challenge.sharedWith.filter((iw) => String(iw.memberId) === memberId)[0]) {
                isOwner = false;
                hasAccepted = true;
                hasInvited = false;
            }
            if (isOwner === '' && hasAccepted === '' && hasInvited === '') {
                isOwner = false;
                hasAccepted = false;
                hasInvited = false;
            }
        }
        let shareWithData = [];
        let sharedWith = challenge.sharedWith;
        for (let i = 0; i < sharedWith.length; i++) { }
        if (challenge.sharedWith.length > 1) {
            shareWithData = challenge.sharedWith.sort((m1, m2) => m2.blendScore - m1.blendScore);
            // let iinviteChallenge;
        }
        // if (challenge.topIngredients.length === 0) {
        //   this.upgradeTopIngredient(challenge._id);
        // }
        return {
            invite,
            sharedWith: shareWithData,
            topIngredients: challenge.topIngredients,
            isOwner: isOwner === '' ? null : isOwner,
            hasAccepted: hasAccepted === '' ? null : hasAccepted,
            hasInvited: hasInvited === '' ? null : hasInvited,
        };
    }
    /**
     * Accepts a challenge invitation.
     *
     * @param {String} inviteId - The ID of the invitation.
     * @param {String} memberId - The ID of the member.
     * @return {String} The ID of the challenge.
     */
    async acceptChallenge(inviteId, memberId) {
        let invite = await InviteForChallenge_1.default.findOne({ _id: inviteId });
        if (!invite) {
            return new AppError_1.default('Invalid invite', 400);
        }
        let data = invite.invitedWith.filter(
        //@ts-ignore
        (iw) => String(iw.memberId) === memberId)[0];
        console.log(data);
        if (!data) {
            return new AppError_1.default('Invalid invite', 400);
        }
        let mongoMemberId = new mongoose_1.default.mongo.ObjectId(memberId.toString());
        let inviteChallenge = await InviteForChallenge_1.default.findOneAndUpdate({ _id: inviteId }, {
            $pull: {
                invitedWith: {
                    memberId: mongoMemberId,
                },
            },
        });
        // await InviteChallengeModel.findOneAndUpdate(
        //   { _id: inviteId },
        //   {
        //     $push: {
        //       memberId: data.memberId,
        //       hasAccepted: true,
        //       canInviteWithOthers: data.canInviteWithOthers,
        //     },
        //   }
        // );
        // await ShareModel.findOneAndUpdate(
        //   {
        //     _id: token,
        //     'shareTo.userId': {
        //       $in: [new mongoose.mongo.ObjectId(userId)],
        //     },
        //   },
        //   {
        //     $set: {
        //       'shareTo.$.hasAccepted': true,
        //     },
        //   }
        // );
        let challengeInfo = await this.getChallengeInfo(String(memberId), false, '', String(invite.challengeId));
        // await InviteChallengeModel.findOneAndUpdate(
        //   {
        //     challengeId: String(invite.challengeId),
        //     'sharedWith.memberId': {
        //       $in: [mongoMemberId],
        //     },
        //   },
        //   {
        //     $set: {
        //       'shareTo.$.hasAccepted': true,
        //       'shareTo.$.blendScore': Math.round(challengeInfo.blendScore),
        //     },
        //   }
        // );
        // await UserChallengeModel.findOneAndUpdate(
        //   {
        //     _id: String(invite.challengeId),
        //   },
        //   {
        //     $push: {
        //       sharedWith: {
        //         memberId: data.memberId,
        //         hasAccepted: !data.hasAccepted,
        //         canInviteWithOthers: data.canInviteWithOthers,
        //         blendScore: Math.round(challengeInfo.blendScore),
        //       },
        //     },
        //   }
        // );
        await this.upgradeTopIngredient(String(invite.challengeId));
        let userChallenge = await challenge_1.default.findOne({
            _id: invite.challengeId,
            'sharedWith.memberId': {
                $in: [mongoMemberId],
            },
        });
        if (userChallenge) {
            await challenge_1.default.findOneAndUpdate({
                _id: invite.challengeId,
                'sharedWith.memberId': {
                    $in: [mongoMemberId],
                },
            }, {
                $set: {
                    'sharedWith.$.canInviteWithOthers': data.canInviteWithOthers,
                },
            });
        }
        else {
            await challenge_1.default.findOneAndUpdate({
                _id: invite.challengeId,
            }, {
                $push: {
                    sharedWith: {
                        memberId: mongoMemberId,
                        canInviteWithOthers: data.canInviteWithOthers,
                        blendScore: Math.round(challengeInfo.blendScore),
                        isDefault: false,
                    },
                },
            });
        }
        return invite.challengeId;
    }
    /**
     * Upgrade the top ingredient for a given challenge.
     *
     * @param {String} challengeId - the ID of the challenge
     * @return {Promise<string>} - a promise that resolves to a string indicating the completion status
     */
    async upgradeTopIngredient(challengeId) {
        let challenge = await challenge_1.default.findOne({
            _id: challengeId,
        });
        let members = [];
        if (challenge.sharedWith.length > 0) {
            members = challenge.sharedWith.map((shared) => shared.memberId);
        }
        members.push(challenge.memberId);
        // let challengePosts = await ChallengePostModel.find({
        //   memberId: { $in: members },
        //   assignDate: { $gte: challenge.startDate, $lte: challenge.endDate },
        // });
        let challengePostDoc = await ChallengePost_2.default.aggregate([
            {
                $match: {
                    memberId: { $in: members },
                    assignDate: { $gte: challenge.startDate, $lte: challenge.endDate },
                },
            },
            {
                $unwind: '$posts',
            },
            {
                $unwind: '$posts.ingredients',
            },
            {
                $group: {
                    _id: '$posts.ingredients.ingredientId',
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);
        let topIngredients = challengePostDoc.map((doc) => {
            return {
                ingredientId: doc._id,
                count: doc.count,
            };
        });
        await challenge_1.default.findOneAndUpdate({
            _id: challengeId,
        }, {
            topIngredients: topIngredients,
        });
        return 'done';
    }
    /**
     * Retrieves all challenge posts by date and member ID.
     *
     * @param {Date} date - The date to search for challenge posts.
     * @param {String} memberId - The ID of the member.
     * @return {Array} An array of challenge post objects.
     */
    async getAllChallengePostByDate(date, memberId) {
        let challengePostDoc = await ChallengePost_2.default.findOne({
            assignDate: date,
            memberId: memberId,
        })
            .populate('posts.recipeBlendCategory')
            .populate('posts.ingredients.ingredientId');
        let posts = [];
        for (let i = 0; i < challengePostDoc.posts.length; i++) {
            posts.push({
                docId: challengePostDoc._id,
                _id: challengePostDoc.posts[i]._id,
                recipeImage: challengePostDoc.posts[i].recipeImage,
                recipeBlendCategory: challengePostDoc.posts[i].recipeBlendCategory,
                images: challengePostDoc.posts[i].images,
                servingSize: challengePostDoc.posts[i].servingSize,
                servings: challengePostDoc.posts[i].servings,
                name: challengePostDoc.posts[i].name,
                note: challengePostDoc.posts[i].note,
                ingredients: challengePostDoc.posts[i].ingredients,
            });
        }
        return posts;
    }
    async editAChallengePost(data) {
        let isoDate = new Date(data.assignDate).toISOString();
        // let prevChallengeDoc = await ChallengePostModel.findOne({
        //   memberId: data.memberId,
        //   assignDate: isoDate,
        // })
        //   .populate('posts.recipeBlendCategory')
        //   .populate('posts.ingredients.ingredientId');
        // let prevDoc = {
        //   _id: prevChallengeDoc._id,
        //   images: prevChallengeDoc.images,
        //   assignDate: prevChallengeDoc.assignDate,
        //   date: new Date(prevChallengeDoc.assignDate).getDate(),
        //   dayName: new Date(prevChallengeDoc.assignDate).toLocaleString('default', {
        //     weekday: 'short',
        //   }),
        //   formattedDate: formateDate(prevChallengeDoc.assignDate),
        //   posts: prevChallengeDoc.posts,
        // };
        // let challengeInfo = await this.getChallengeInfo(
        //   data.memberId,
        //   false,
        //   '',
        //   String(userChallenge._id)
        // );
        let blendCategory = await recipeCategory_1.default.findOne({
            _id: data.post.recipeBlendCategory,
        }).select('name');
        let post = data.post;
        if (data.post.name === '' || data.post.name === undefined) {
            post.name = blendCategory.name + ' ' + (0, FormateDate_1.default)(new Date(isoDate));
        }
        for (let i = 0; i < data.post.ingredients.length; i++) {
            post.ingredients[i].portions = [];
            let ingredient = await blendIngredient_1.default.findOne({
                _id: post.ingredients[i].ingredientId,
            });
            let index = 0;
            let selectedPortionIndex = 0;
            for (let j = 0; j < ingredient.portions.length; j++) {
                if (ingredient.portions[j].default === true) {
                    index = j;
                    break;
                }
            }
            for (let k = 0; k < ingredient.portions.length; k++) {
                if (ingredient.portions[k].measurement ===
                    post.ingredients[i].selectedPortionName) {
                    selectedPortionIndex = k;
                }
                let portion = {
                    name: ingredient.portions[k].measurement,
                    quantity: post.ingredients[i].weightInGram /
                        +ingredient.portions[k].meausermentWeight,
                    default: ingredient.portions[k].default,
                    gram: ingredient.portions[k].meausermentWeight,
                };
                post.ingredients[i].portions.push(portion);
            }
            post.ingredients[i].selectedPortion = {
                name: ingredient.portions[selectedPortionIndex].measurement,
                quantity: post.ingredients[i].weightInGram /
                    +ingredient.portions[selectedPortionIndex].meausermentWeight,
                gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
            };
        }
        if (!data.memberId || !data.assignDate) {
            return new AppError_1.default('Please provide memberId and assignDate', 400);
        }
        let challenge = await ChallengePost_2.default.findOne({
            _id: post.docId,
        });
        let previousPost = challenge.posts.filter(
        //@ts-ignore
        (item) => String(item._id) === String(post._id))[0];
        let prevPost = null;
        if (previousPost) {
            prevPost = {
                prevPostDate: (0, FormateDate_1.default)(challenge.assignDate),
                //@ts-ignore
                postId: previousPost._id,
            };
        }
        await ChallengePost_2.default.findOneAndUpdate({
            _id: post.docId,
        }, {
            $pull: {
                posts: { _id: post._id },
            },
        });
        for (let i = 0; i < previousPost.images.length; i++) {
            await ChallengePost_2.default.findOneAndUpdate({
                _id: post.docId,
            }, {
                $pull: {
                    images: {
                        url: previousPost.images[i].url,
                    },
                },
            });
        }
        let challengePostDoc = await ChallengePost_2.default.findOne({
            memberId: data.memberId,
            assignDate: isoDate,
        });
        if (challengePostDoc) {
            let images = [];
            for (let i = 0; i < data.post.images.length; i++) {
                images = await this.addUniqueObj(challengePostDoc.images, data.post.images[i]);
            }
            await ChallengePost_2.default.findOneAndUpdate({
                _id: challengePostDoc._id,
            }, {
                $push: { posts: post },
                images: images,
            }, {
                new: true,
            });
        }
        else {
            await ChallengePost_2.default.create({
                memberId: data.memberId,
                assignDate: isoDate,
                posts: [post],
                images: data.post.images,
            });
        }
        let userChallenge = await challenge_1.default.findOne({
            memberId: data.memberId,
            isActive: true,
        });
        let challengeDoc = await ChallengePost_2.default.findOne({
            memberId: data.memberId,
            assignDate: isoDate,
        })
            .populate('posts.recipeBlendCategory')
            .populate('posts.ingredients.ingredientId');
        let doc = {
            _id: challengeDoc._id,
            images: challengeDoc.images,
            assignDate: challengeDoc.assignDate,
            date: new Date(challengeDoc.assignDate).getDate(),
            dayName: new Date(challengeDoc.assignDate).toLocaleString('default', {
                weekday: 'short',
            }),
            formattedDate: (0, FormateDate_1.default)(challengeDoc.assignDate),
            posts: challengeDoc.posts,
        };
        let challengeInfo = await this.getChallengeInfo(data.memberId, false, '', String(userChallenge._id));
        return {
            challenge: doc,
            prevPost,
            challengeInfo: challengeInfo,
        };
    }
    async checkIfChallengeIsGlobal(challengeId, token) {
        let data = await shareChallengeGlobal_1.default.findOne({
            challengeId: challengeId,
            _id: token,
        });
        if (data) {
            return true;
        }
        else {
            return false;
        }
    }
    async checkIfChallengeIsInvitedWithMe(memberId) {
        let member = await memberModel_1.default.findOne({ _id: memberId }).select('defaultChallengeId');
        if (!member.defaultChallengeId) {
            return null;
        }
        let challengeId = String(member.defaultChallengeId);
        let userChallenge = await challenge_1.default.findOne({
            _id: challengeId,
            'sharedWith.memberId': {
                $in: memberId.toString(),
            },
        }).select('sharedWith');
        if (!userChallenge) {
            return null;
        }
        let sharedWith = userChallenge.sharedWith.filter((sw) => String(sw.memberId) === memberId)[0];
        if (!sharedWith) {
            return null;
        }
        if (!sharedWith.isDefault) {
            return null;
        }
        return userChallenge._id;
    }
    async getLastSevenDaysChallenge(memberId, startDate) {
        let challenge = null;
        let viewOnly = false;
        challenge = await challenge_1.default.findOne({
            memberId: memberId,
            isActive: true,
        });
        if (!challenge) {
            let inviteChallengeId = await this.checkIfChallengeIsInvitedWithMe(memberId);
            if (inviteChallengeId) {
                challenge = await challenge_1.default.findOne({
                    _id: inviteChallengeId,
                });
            }
        }
        if (!challenge) {
            return new AppError_1.default('No default challenge found', 404);
        }
        let tempDay = new Date(new Date(startDate).toISOString().slice(0, 10));
        let challengeDocs = [];
        for (let i = 0; i < 7; i++) {
            let challengeDoc = await ChallengePost_2.default.findOne({
                memberId: memberId,
                assignDate: tempDay,
            }).populate('posts.recipeBlendCategory');
            if (challengeDoc) {
                challengeDocs.push({
                    _id: challengeDoc._id,
                    images: challengeDoc.images,
                    assignDate: challengeDoc.assignDate,
                    date: new Date(challengeDoc.assignDate).getDate(),
                    dayName: new Date(challengeDoc.assignDate).toLocaleString('default', {
                        weekday: 'short',
                    }),
                    formattedDate: (0, FormateDate_1.default)(challengeDoc.assignDate),
                    posts: challengeDoc.posts,
                });
                tempDay = new Date(tempDay.setDate(tempDay.getDate() + 1));
                continue;
            }
            else {
                challengeDocs.push({
                    _id: (0, FormateDate_1.default)(tempDay),
                    assignDate: new Date(tempDay.setDate(tempDay.getDate() + 0)),
                    date: new Date(tempDay.setDate(tempDay.getDate() + 0)).getDate(),
                    dayName: new Date(tempDay.setDate(tempDay.getDate() + 0)).toLocaleString('default', { weekday: 'short' }),
                    formattedDate: (0, FormateDate_1.default)(tempDay),
                    posts: [],
                });
            }
            tempDay = new Date(tempDay.setDate(tempDay.getDate() + 1));
        }
        let challengeInfo = await this.getChallengeInfo(memberId, viewOnly, '', challenge._id);
        return { challenge: challengeDocs, challengeInfo: challengeInfo };
    }
    async getMyThirtyDaysChallenge(memberId, startDate, token, challengeId) {
        let challenge = null;
        let viewOnly = false;
        if (challengeId && token) {
            let check = await this.checkIfChallengeIsGlobal(challengeId, token);
            if (!check) {
                return new AppError_1.default('you are not authorized', 404);
            }
            viewOnly = true;
            challenge = await challenge_1.default.findOne({
                _id: challengeId,
            });
            if (challenge) {
                memberId = challenge.memberId;
            }
        }
        else {
            if (challengeId) {
                challenge = await challenge_1.default.findOne({ _id: challengeId });
            }
            else {
                challenge = await challenge_1.default.findOne({
                    memberId: memberId,
                    isActive: true,
                });
                console.log('c', challenge);
                if (!challenge) {
                    let inviteChallengeId = await this.checkIfChallengeIsInvitedWithMe(memberId);
                    if (inviteChallengeId) {
                        challenge = await challenge_1.default.findOne({
                            _id: inviteChallengeId,
                        });
                    }
                }
            }
        }
        if (!challenge) {
            return new AppError_1.default('No default challenge found', 404);
        }
        let tempDay;
        if (!startDate || startDate === '') {
            tempDay = new Date(new Date().toISOString().slice(0, 10));
            if (challenge.days > 30) {
                if (challenge.startDate <= tempDay && challenge.endDate >= tempDay) {
                    //@ts-ignore
                    let diffTime = Math.abs(tempDay - challenge.startDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays >= 30) {
                        let StartCount = Math.abs(diffDays - 30) + 1;
                        let day = challenge.startDate;
                        tempDay = new Date(day.setDate(day.getDate() + StartCount));
                    }
                    else {
                        tempDay = challenge.startDate;
                    }
                }
                else {
                    let day = challenge.endDate;
                    tempDay = new Date(day.setDate(day.getDate() - 30));
                }
            }
            else {
                tempDay = challenge.startDate;
            }
        }
        else {
            tempDay = new Date(new Date(startDate).toISOString().slice(0, 10));
        }
        let challengeDocs = [];
        for (let i = 0; i < 30; i++) {
            let challengeDoc = await ChallengePost_2.default.findOne({
                memberId: memberId,
                assignDate: tempDay,
            })
                .populate('posts.recipeBlendCategory')
                .populate('posts.ingredients.ingredientId');
            if (tempDay > challenge.endDate) {
                challengeDocs.push({
                    _id: (0, FormateDate_1.default)(tempDay),
                    assignDate: new Date(tempDay.setDate(tempDay.getDate() + 0)),
                    date: new Date(tempDay.setDate(tempDay.getDate() + 0)).getDate(),
                    dayName: new Date(tempDay.setDate(tempDay.getDate() + 0)).toLocaleString('default', { weekday: 'short' }),
                    disabled: true,
                    posts: [],
                    formattedDate: (0, FormateDate_1.default)(tempDay),
                });
                tempDay = new Date(tempDay.setDate(tempDay.getDate() + 1));
                continue;
            }
            if (challengeDoc) {
                challengeDocs.push({
                    _id: challengeDoc._id,
                    images: challengeDoc.images,
                    assignDate: challengeDoc.assignDate,
                    date: new Date(challengeDoc.assignDate).getDate(),
                    dayName: new Date(challengeDoc.assignDate).toLocaleString('default', {
                        weekday: 'short',
                    }),
                    formattedDate: (0, FormateDate_1.default)(challengeDoc.assignDate),
                    posts: challengeDoc.posts,
                });
                tempDay = new Date(tempDay.setDate(tempDay.getDate() + 1));
                continue;
            }
            else {
                challengeDocs.push({
                    _id: (0, FormateDate_1.default)(tempDay),
                    assignDate: new Date(tempDay.setDate(tempDay.getDate() + 0)),
                    date: new Date(tempDay.setDate(tempDay.getDate() + 0)).getDate(),
                    dayName: new Date(tempDay.setDate(tempDay.getDate() + 0)).toLocaleString('default', { weekday: 'short' }),
                    formattedDate: (0, FormateDate_1.default)(tempDay),
                    posts: [],
                });
            }
            tempDay = new Date(tempDay.setDate(tempDay.getDate() + 1));
        }
        let challengeInfoDate = startDate ? startDate : '';
        let challengeInfo = await this.getChallengeInfo(memberId, viewOnly, challengeInfoDate, challenge._id);
        console.log('ci', challengeInfo);
        return { challenge: challengeDocs, challengeInfo: challengeInfo };
    }
    async getChallengeGallery(memberId) {
        let challengeDoc = await ChallengePost_2.default.find({
            memberId: memberId,
        }).sort({ assignDate: 1 });
        let galleryImages = [];
        for (let i = 0; i < challengeDoc.length; i++) {
            //@ts-ignore
            challengeDoc[i].posts.forEach((post) => {
                if (post.images.length > 0) {
                    galleryImages.push({
                        assignDate: challengeDoc[i].assignDate,
                        images: post.images,
                    });
                }
            });
        }
        return galleryImages;
    }
    async getAChallengeGallery(memberId) {
        let challenge = await challenge_1.default.findOne({
            memberId: memberId,
            isActive: true,
        });
        let challengeDocs = await ChallengePost_2.default.find({
            memberId: challenge.memberId,
            assignDate: { $gte: challenge.startDate, $lte: challenge.endDate },
            posts: { $ne: [] },
        })
            .sort({ assignDate: -1 })
            .lean();
        return challengeDocs;
    }
    async getChallengeInfo(memberId, viewOnly, startDate, challengeId) {
        let today = new Date(new Date().toISOString().slice(0, 10));
        let memberInfo = await memberModel_1.default.findOne({ _id: memberId }).select('image displayName');
        let count = await ChallengePost_2.default.countDocuments({
            memberId: memberId,
            posts: { $ne: [] },
        });
        let challenge = {};
        if (challengeId) {
            challenge = await challenge_1.default.findOne({
                _id: challengeId,
            }, { topIngredients: { $slice: 5 } })
                .populate({
                path: 'sharedWith.memberId',
                select: 'image displayName fistName lastName email',
            })
                .sort({ blendScore: -1 })
                .populate({
                path: 'topIngredients.ingredientId',
                select: 'ingredientName featuredImage',
            });
        }
        else {
            challenge = await challenge_1.default.findOne({
                memberId: memberId,
                isActive: true,
            }, { topIngredients: { $slice: 5 }, sharedWith: { $slice: 5 } })
                .populate({
                path: 'sharedWith.memberId',
                select: 'image displayName fistName lastName email',
            })
                .populate({
                path: 'topIngredients.ingredientId',
                select: 'ingredientName featuredImage',
            });
        }
        let shareWithData = [];
        if (challenge.sharedWith.length > 1) {
            shareWithData = challenge.sharedWith.sort((m1, m2) => m2.blendScore - m1.blendScore);
        }
        let challengeDocs = await ChallengePost_2.default.find({
            memberId: memberId,
            assignDate: { $gte: challenge.startDate, $lte: challenge.endDate },
            posts: { $ne: [] },
        }).sort({ assignDate: 1 });
        let challengeDocsForRecent = await ChallengePost_2.default.find({
            memberId: memberId,
            assignDate: { $gte: challenge.startDate, $lte: today },
            posts: { $ne: [] },
        }).select('_id');
        let daysRemaining = 0;
        if (challenge.startDate > today) {
            daysRemaining = challenge.days;
        }
        else if (today > challenge.endDate) {
            daysRemaining = 0;
        }
        else {
            //@ts-ignore
            let diffTime = Math.abs(today - challenge.endDate);
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            daysRemaining = diffDays;
        }
        if (challengeDocs.length === 0) {
            return {
                longestStreak: 0,
                currentStreak: 0,
                blendScore: 0,
                viewOnly: viewOnly ? viewOnly : false,
                days: challenge.days,
                daysRemaining: daysRemaining,
                challengeName: challenge.challengeName,
                challengeId: challenge._id,
                totalChallengePosts: count,
                startDate: (0, FormateDate_1.default)(challenge.startDate),
                endDate: (0, FormateDate_1.default)(challenge.endDate),
                memberInfo: {
                    _id: memberInfo._id,
                    displayName: memberInfo.displayName,
                    image: memberInfo.image,
                },
                sharedWith: shareWithData,
                topIngredients: challenge.topIngredients,
            };
        }
        let tempDay = challengeDocs[challengeDocs.length - 1].assignDate;
        let longestStreak = 1;
        let currentStreak = 1;
        let myCurrentStreak = 1;
        let isBreak = true;
        for (let i = challengeDocs.length - 2; i >= 0; i--) {
            //@ts-ignore
            let diffTime = Math.abs(tempDay - challengeDocs[i].assignDate);
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                currentStreak++;
                if (isBreak) {
                    myCurrentStreak = currentStreak;
                }
                tempDay = challengeDocs[i].assignDate;
                if (longestStreak < currentStreak) {
                    longestStreak = currentStreak;
                }
            }
            else {
                if (isBreak) {
                    myCurrentStreak = currentStreak;
                    isBreak = false;
                }
                currentStreak = 1;
                tempDay = challengeDocs[i].assignDate;
                if (longestStreak < currentStreak) {
                    longestStreak = currentStreak;
                    currentStreak = 1;
                }
            }
        }
        let blendScore = 0;
        if (challengeDocsForRecent.length > 0) {
            //@ts-ignore
            let diffTime = Math.abs(today - challenge.startDate);
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            blendScore = (100 / diffDays) * challengeDocsForRecent.length;
        }
        this.upgradeTopIngredient(challengeId);
        let challengeInfo = {
            longestStreak: longestStreak,
            currentStreak: myCurrentStreak,
            viewOnly: viewOnly,
            blendScore: blendScore,
            days: challenge.days,
            daysRemaining: daysRemaining,
            challengeName: challenge.challengeName,
            challengeId: challenge._id,
            totalChallengePosts: count,
            startDate: (0, FormateDate_1.default)(challenge.startDate),
            endDate: (0, FormateDate_1.default)(challenge.endDate),
            memberInfo: {
                _id: memberInfo._id,
                displayName: memberInfo.displayName,
                image: memberInfo.image,
            },
            sharedWith: shareWithData,
            topIngredients: challenge.topIngredients,
        };
        return challengeInfo;
    }
    async getLatestChallengePost(memberId) {
        let today = new Date(new Date().toISOString().slice(0, 10));
        let challenge = await challenge_1.default.findOne({
            memberId: memberId,
            isActive: true,
        });
        let challengeDocs = await ChallengePost_2.default.find({
            memberId: challenge.memberId,
            assignDate: { $lte: today },
            posts: { $ne: [] },
        })
            .sort({ assignDate: 1 })
            .select('_id');
        if (challengeDocs.length === 0) {
            return [];
        }
        let challengePostDoc = await ChallengePost_2.default.findOne({
            _id: challengeDocs[challengeDocs.length - 1]._id,
        })
            .populate('posts.recipeBlendCategory')
            .populate('posts.ingredients.ingredientId');
        // .populate({
        //   path: 'posts.recipeId',
        //   model: 'Recipe',
        //   populate: [
        //     { path: 'recipeBlendCategory' },
        //     { path: 'brand' },
        //     {
        //       path: 'defaultVersion',
        //       model: 'RecipeVersion',
        //       populate: {
        //         path: 'ingredients.ingredientId',
        //         model: 'BlendIngredient',
        //         select: 'ingredientName',
        //       },
        //       select: 'postfixTitle',
        //     },
        //     {
        //       path: 'ingredients.ingredientId',
        //       model: 'BlendIngredient',
        //     },
        //   ],
        // });
        return challengePostDoc;
    }
    // @Query(() => String)
    // async nnmm() {
    //   let challengePostDoc = await ChallengePostModel.find();
    //   for (let i = 0; i < challengePostDoc.length; i++) {
    //     if (challengePostDoc[i].images.length === 0) {
    //       await ChallengePostModel.findOneAndUpdate(
    //         {
    //           _id: challengePostDoc[i]._id,
    //         },
    //         {
    //           images: [],
    //         }
    //       );
    //     }
    //   }
    // }
    async getChallengePosts(memberId, limit, page) {
        let ChallengeDocs = await ChallengePost_2.default.find({
            memberId: memberId,
            posts: { $ne: [] },
        })
            .populate('posts.recipeBlendCategory')
            .populate('posts.ingredients.ingredientId')
            .limit(limit)
            .skip(limit * (page - 1))
            .sort({ assignDate: 1 });
        let count = await ChallengePost_2.default.countDocuments({
            memberId: memberId,
            posts: { $ne: [] },
        });
        return {
            challenge: ChallengeDocs,
            totalPost: count,
        };
    }
    // @Query(() => String)
    // async jdijdiejidjeijdiej() {
    //   let docs = await ChallengePostModel.find();
    //   for (let i = 0; i < docs.length; i++) {
    //     await ChallengePostModel.findOneAndUpdate(
    //       {
    //         _id: docs[i]._id,
    //       },
    //       {
    //         date: docs[i].assignDate.toISOString().slice(0, 10),
    //       }
    //     );
    //   }
    //   return 'done';
    // }
    async deleteAChallengePost(docId, postId) {
        let doc = await ChallengePost_2.default.findOne({ _id: docId }).select('date');
        await ChallengePost_2.default.findOneAndUpdate({ _id: docId }, {
            $pull: { posts: { _id: postId } },
        });
        return {
            date: doc.date,
            postId: postId,
            docId: docId,
        };
    }
    async copyAChallengePost(docId, postId, assignDate, memberId) {
        let doc = await ChallengePost_2.default.findOne({ _id: docId });
        let isoDate = new Date(assignDate).toISOString();
        let post = await doc.posts.filter(
        //@ts-ignore
        (post) => String(post._id) === postId)[0];
        delete post._id;
        let challengePostDoc = await ChallengePost_2.default.findOne({
            memberId: memberId,
            assignDate: isoDate,
        });
        if (challengePostDoc) {
            await ChallengePost_2.default.findOneAndUpdate({
                _id: challengePostDoc._id,
            }, {
                $push: { posts: post, images: { $each: post.images } },
            });
        }
        else {
            await ChallengePost_2.default.create({
                memberId: memberId,
                assignDate: isoDate,
                images: post.images,
                posts: [post],
                date: assignDate,
            });
        }
        return 'post copied';
    }
    async moveAChallengePost(docId, postId, assignDate, memberId) {
        let doc = await ChallengePost_2.default.findOne({ _id: docId });
        let isoDate = new Date(assignDate).toISOString();
        let post = await doc.posts.filter(
        //@ts-ignore
        (post) => String(post._id) === postId)[0];
        delete post._id;
        await await ChallengePost_2.default.findOneAndUpdate({ _id: docId }, {
            $pull: { posts: { _id: postId } },
        });
        let challengePostDoc = await ChallengePost_2.default.findOne({
            memberId: memberId,
            assignDate: isoDate,
        });
        if (challengePostDoc) {
            await ChallengePost_2.default.findOneAndUpdate({
                _id: challengePostDoc._id,
            }, {
                $push: { posts: post, images: { $each: post.images } },
            });
        }
        else {
            await ChallengePost_2.default.create({
                memberId: memberId,
                assignDate: isoDate,
                images: post.images,
                posts: [post],
                date: assignDate,
            });
        }
        return 'post moved';
    }
    async getIngredientsStats(currentDate) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        let firstday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
        let lastday = new Date(today.setDate(today.getDate() + 6));
        let challengePostDoc = await ChallengePost_2.default.find({
            memberId: '61c1e18ab0b6d08ad8f7484f',
            assignDate: { $gte: '2022-09-22T00:00:00.000+00:00' },
        });
        // let challengePostDoc = await ChallengePostModel.aggregate([
        //   {
        //     $match: {
        //       memberId: new mongoose.mongo.ObjectId('61c1e18ab0b6d08ad8f7484f'),
        //       'posts.ingredients.ingredientId': new mongoose.mongo.ObjectId(
        //         '620b6bd640d3f19b558f0c1e'
        //       ),
        //       assignDate: { $gte: '2022-07-16T00:00:00.000+00:00' },
        //     },
        //   },
        //   { $unwind: '$posts.ingredients.weightInGram' },
        //   {
        //     $group: {
        //       _id: '$posts.ingredients.ingredientId',
        //       count: { $sum: 1 },
        //     },
        //   },
        // ]);
        // let selectedPortions = challengePostDoc.map((doc) => doc.posts.);
        // console.log(challengePostDoc);
        let posts = [];
        for (let i = 0; i < challengePostDoc.length; i++) {
            for (let j = 0; j < challengePostDoc[i].posts.length; j++) {
                posts.push({
                    date: challengePostDoc[i].assignDate,
                    ingredients: challengePostDoc[i].posts[j].ingredients,
                });
            }
        }
        let sum = 0;
        for (let k = 0; k < posts.length; k++) {
            for (let l = 0; l < posts[k].ingredients.length; l++) {
                if (String(posts[k].ingredients[l].ingredientId) ===
                    '620b6bd640d3f19b558f0c1e') {
                    sum += posts[k].ingredients[l].weightInGram;
                }
            }
        }
        return 'done';
    }
    async testGetIngredientsStats(currentDate, memberId, ingredientId, type) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        const year = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 365));
        const thisYear = new Date(new Date(`${today.getFullYear()}-01-01`).toISOString().slice(0, 10));
        const month = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 29));
        const week = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 7));
        let blendIngredint = await blendIngredient_1.default.findOne({
            _id: ingredientId,
        }).select('portions category');
        let category = '';
        if (!blendIngredint.category || blendIngredint.category === '') {
            category = 'All';
        }
        else {
            category = blendIngredint.category;
        }
        let defaultPortion = blendIngredint.portions.filter(
        //@ts-ignore
        (portion) => portion.default)[0];
        if (!defaultPortion) {
            defaultPortion = blendIngredint.portions[0];
        }
        let query = {};
        let queryForAll = {};
        let startDate = today;
        if (type === 'Y') {
            query = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                'posts.ingredients.ingredientId': new mongoose_1.default.mongo.ObjectId(ingredientId),
                assignDate: { $gte: thisYear, $lte: today },
            };
            queryForAll = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                assignDate: { $gte: thisYear, $lte: today },
            };
            startDate = thisYear;
        }
        else if (type === 'YD') {
            query = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                'posts.ingredients.ingredientId': new mongoose_1.default.mongo.ObjectId(ingredientId),
                assignDate: { $gte: year, $lte: today },
            };
            queryForAll = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                assignDate: { $gte: year, $lte: today },
            };
            startDate = year;
        }
        else if (type === 'W') {
            query = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                'posts.ingredients.ingredientId': new mongoose_1.default.mongo.ObjectId(ingredientId),
                assignDate: { $gte: week, $lte: today },
            };
            queryForAll = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                assignDate: { $gte: week, $lte: today },
            };
            startDate = week;
        }
        else if (type == 'M') {
            query = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                'posts.ingredients.ingredientId': new mongoose_1.default.mongo.ObjectId(ingredientId),
                assignDate: { $gte: month, $lte: today },
            };
            queryForAll = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                assignDate: { $gte: month, $lte: today },
            };
            startDate = month;
        }
        else {
            return new AppError_1.default('Please select a valid type Y-M-W-YD', 400);
        }
        let challengePostDoc = await ChallengePost_2.default.aggregate([
            {
                $match: query,
            },
            { $unwind: '$posts' },
            { $unwind: '$posts.ingredients' },
            {
                $match: {
                    'posts.ingredients.ingredientId': new mongoose_1.default.mongo.ObjectId(ingredientId),
                },
            },
            {
                $group: {
                    _id: '$assignDate',
                    // ingredients: { $push: '$posts.ingredients' },
                    consumptionInGram: { $sum: '$posts.ingredients.weightInGram' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        let challengePostDocForAll = await ChallengePost_2.default.aggregate([
            { $match: queryForAll },
            { $unwind: '$posts' },
            { $unwind: '$posts.ingredients' },
            {
                $group: {
                    _id: '$posts.ingredients.ingredientId',
                    consumptionInGram: { $sum: '$posts.ingredients.weightInGram' },
                },
            },
            { $sort: { consumptionInGram: -1 } },
        ]);
        let otherIngredients = await this.getNameandFilterWithCategory(category, challengePostDocForAll);
        let modifiedByTypes = await (0, OrganizeByTypes_1.default)(challengePostDoc, type, today, startDate);
        let ingredientStatsWithPortion = {
            portion: defaultPortion,
            category: category,
            stats: modifiedByTypes,
            otherIngredients: otherIngredients,
        };
        return ingredientStatsWithPortion;
    }
    async getNameandFilterWithCategory(category, allIngredients) {
        let returnArray = [];
        for (let i = 0; i < allIngredients.length; i++) {
            let ingredient = await blendIngredient_1.default.findOne({
                _id: allIngredients[i]._id,
            }).select('ingredientName category portions');
            let defaultPortion = ingredient.portions.filter(
            //@ts-ignore
            (portion) => portion.default === true)[0];
            if (!defaultPortion) {
                defaultPortion = ingredient.portions[0];
            }
            if (category !== 'All') {
                if (ingredient.category === category) {
                    returnArray.push({
                        _id: allIngredients[i]._id,
                        name: ingredient.ingredientName,
                        portion: defaultPortion,
                        consumptionInGram: allIngredients[i].consumptionInGram,
                    });
                }
            }
            else {
                returnArray.push({
                    _id: allIngredients[i]._id,
                    name: ingredient.ingredientName,
                    portion: defaultPortion,
                    consumptionInGram: allIngredients[i].consumptionInGram,
                });
            }
        }
        return returnArray;
    }
    async testGetNuteientsStats(currentDate, memberId, nutrientId, type) {
        let averageValue = 1;
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        let thisYear = new Date(new Date(`${today.getFullYear()}-01-01`).toISOString().slice(0, 10));
        const year = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 365));
        const month = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 29));
        const week = new Date(new Date(currentDate).setDate(new Date(currentDate).getDate() - 7));
        let blendNutrient = await blendNutrient_1.default.findOne({
            _id: nutrientId,
        }).select('units');
        let queryForAll = {};
        let startDate = today;
        if (type === 'Y') {
            //@ts-ignore
            const diffInMs = Math.abs(today - thisYear);
            let days = diffInMs / (1000 * 60 * 60 * 24);
            averageValue = days;
            queryForAll = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                assignDate: { $gte: thisYear, $lte: today },
            };
            startDate = thisYear;
        }
        else if (type === 'YD') {
            averageValue = 365;
            queryForAll = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                assignDate: { $gte: year, $lte: today },
            };
            startDate = year;
        }
        else if (type === 'W') {
            averageValue = 7;
            queryForAll = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                assignDate: { $gte: week, $lte: today },
            };
            startDate = week;
        }
        else if (type == 'M') {
            averageValue = 30;
            queryForAll = {
                memberId: new mongoose_1.default.mongo.ObjectId(memberId),
                assignDate: { $gte: month, $lte: today },
            };
            startDate = month;
        }
        else {
            return new AppError_1.default('Please select a valid type Y-M-W-YD', 400);
        }
        let challengePostDocForAll = await ChallengePost_2.default.aggregate([
            { $match: queryForAll },
            { $unwind: '$posts' },
            { $unwind: '$posts.ingredients' },
            {
                $group: {
                    _id: '$posts.ingredients.ingredientId',
                    assignDate: { $first: '$assignDate' },
                    // ingredientId: '$posts.ingredients.ingredientId',
                    quantity: { $sum: '$posts.ingredients.selectedPortion.quantity' },
                },
            },
        ]);
        let returnArray = await this.getTopIngredientByNutrient(challengePostDocForAll, nutrientId, blendNutrient.units);
        //@ts-ignore
        returnArray.returnObj.sort((a, b) => {
            return b.totalAmount - a.totalAmount;
        });
        let dailyAverageAmount = returnArray.totalAmountNutrient / averageValue;
        let modifiedByTypes = await (0, OrganizeByTypesForNutrition_1.default)(returnArray.returnObjDate, type, today, startDate);
        let dailyRecommendedAmount = await (0, GetDailyRecomendedAndUpperLimit_1.default)(memberId, nutrientId);
        // console.log(dailyRecommendedAmount);
        return {
            ingredientStats: returnArray.returnObj,
            dateStats: modifiedByTypes,
            dailyAverage: dailyAverageAmount,
            dailyRecomended: dailyRecommendedAmount.dailyRecomended,
            attainment: dailyAverageAmount - dailyRecommendedAmount.dailyRecomended,
            upperLimit: dailyRecommendedAmount.upperLimit,
            units: blendNutrient.units,
        };
    }
    async getTopIngredientByNutrient(allIngredients, nutrientId, units) {
        let returnObj = [];
        let returnObjDate = [];
        let totalAmountNutrient = 0;
        for (let i = 0; i < allIngredients.length; i++) {
            let ingredient = await blendIngredient_1.default.findOne({
                _id: allIngredients[i]._id,
            }).select('blendNutrients ingredientName portions');
            let defaultPortion = ingredient.portions.filter(
            //@ts-ignore
            (portion) => portion.default === true)[0];
            if (!defaultPortion) {
                defaultPortion = ingredient.portions[0];
            }
            //@ts-ignore
            let blendNutrients = ingredient.blendNutrients.filter((blendNutrient) => {
                return String(blendNutrient.blendNutrientRefference) === nutrientId;
            });
            //@ts-ignore
            let totalAmount = blendNutrients.reduce((acc, curr) => {
                return acc + curr.value * allIngredients[i].quantity;
            }, 0);
            returnObj.push({
                _id: allIngredients[i]._id,
                ingredientName: ingredient.ingredientName,
                totalAmount: totalAmount,
                units: units,
                defaultPortion: defaultPortion,
            });
            let index = returnObjDate.findIndex((obj) => obj.assignDate.toString().slice(0, 10) ===
                allIngredients[i].assignDate.toString().slice(0, 10));
            if (index === -1) {
                returnObjDate.push({
                    assignDate: allIngredients[i].assignDate,
                    totalAmount: totalAmount,
                });
            }
            else {
                returnObjDate[index].totalAmount += totalAmount;
            }
            totalAmountNutrient += totalAmount;
        }
        return {
            totalAmountNutrient: totalAmountNutrient,
            returnObj: returnObj,
            returnObjDate: returnObjDate,
        };
    }
    async gobletOfFire() {
        let cps = await ChallengePost_2.default.find();
        for (let i = 0; i < cps.length; i++) {
            if (!cps[i].date) {
                cps[i].date = (0, FormateDate_1.default)(cps[i].assignDate);
                await cps[i].save();
            }
        }
        return 'd';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String)
    /**
     * Asynchronously inserts data into the database.
     *
     * @return {Promise<string>} A promise that resolves with the string 'done' when the data is successfully inserted.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "ins", null);
__decorate([
    (0, type_graphql_1.Query)(() => String)
    /**
     * Updates challenge 889.
     *
     * @return {Promise<string>} A string indicating the completion of the update.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "updateChallenge889", null);
__decorate([
    (0, type_graphql_1.Query)(() => [IngredientData_1.default])
    /**
     * Retrieves the ingredients from a recipe.
     *
     * @param {string} recipeId - The ID of the recipe.
     * @return {Promise<Array>} The list of ingredients.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getIngredientsFromARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ChsllengeAndSingleDoc_1.default)
    /**
     * Create a challenge post.
     *
     * @param {CreateChallengePost} data - the data for creating a challenge post
     * @return {Promise} a Promise that resolves to an object containing the created challenge post and related information
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateChallengePost_1.default]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "createChallengePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Invites a user to a challenge.
     *
     * @param {String} challengeId - The ID of the challenge.
     * @param {String} invitedBy - The ID of the user who is inviting.
     * @param {[String]} invitedWith - An array of user IDs who are invited.
     * @param {Boolean} canInviteWithOthers - Whether the user can invite others.
     * @param {string} currentDate - The current date (optional).
     * @return {String} - The ID of the created invite challenge.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __param(1, (0, type_graphql_1.Arg)('invitedBy')),
    __param(2, (0, type_graphql_1.Arg)('invitedWith', (type) => [String])),
    __param(3, (0, type_graphql_1.Arg)('canInviteWithOthers')),
    __param(4, (0, type_graphql_1.Arg)('currentDate', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, Array, Boolean, String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "inviteToChallenge", null);
__decorate([
    (0, type_graphql_1.Query)(() => InviteInfoSharedWithAndTopIngredients_1.default)
    /**
     * Retrieves information about an invite challenge.
     *
     * @param {String} inviteId - The ID of the invite.
     * @param {String} memberId - The ID of the member. (optional)
     * @return {Object} An object containing the invite, sharedWith, topIngredients, isOwner, hasAccepted, and hasInvited.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('inviteId')),
    __param(1, (0, type_graphql_1.Arg)('memberId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getInviteChallengeInfo", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Accepts a challenge invitation.
     *
     * @param {String} inviteId - The ID of the invitation.
     * @param {String} memberId - The ID of the member.
     * @return {String} The ID of the challenge.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('inviteId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "acceptChallenge", null);
__decorate([
    (0, type_graphql_1.Query)(() => String)
    /**
     * Upgrade the top ingredient for a given challenge.
     *
     * @param {String} challengeId - the ID of the challenge
     * @return {Promise<string>} - a promise that resolves to a string indicating the completion status
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "upgradeTopIngredient", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ChallengePost_1.default])
    /**
     * Retrieves all challenge posts by date and member ID.
     *
     * @param {Date} date - The date to search for challenge posts.
     * @param {String} memberId - The ID of the member.
     * @return {Array} An array of challenge post objects.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('date')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getAllChallengePostByDate", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ChsllengeAndSingleDoc_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditChallengePost_1.default]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "editAChallengePost", null);
__decorate([
    (0, type_graphql_1.Query)(() => ChallengeAndChallengeDocs_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('startDate', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getLastSevenDaysChallenge", null);
__decorate([
    (0, type_graphql_1.Query)(() => ChallengeAndChallengeDocs_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('startDate', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('token', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('challengeId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getMyThirtyDaysChallenge", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ChallengePost_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getChallengeGallery", null);
__decorate([
    (0, type_graphql_1.Query)(() => [GalleryImage_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getAChallengeGallery", null);
__decorate([
    (0, type_graphql_1.Query)(() => ChallngeInfo_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('viewOnly', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('startDate', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('challengeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Boolean, String, String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getChallengeInfo", null);
__decorate([
    (0, type_graphql_1.Query)(() => Challenge_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getLatestChallengePost", null);
__decorate([
    (0, type_graphql_1.Query)(() => ChallengePostWithCount_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('limit')),
    __param(2, (0, type_graphql_1.Arg)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getChallengePosts", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => DateDocPostId_1.default),
    __param(0, (0, type_graphql_1.Arg)('docId')),
    __param(1, (0, type_graphql_1.Arg)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "deleteAChallengePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('docId')),
    __param(1, (0, type_graphql_1.Arg)('postId')),
    __param(2, (0, type_graphql_1.Arg)('assignDate')),
    __param(3, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, String, String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "copyAChallengePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('docId')),
    __param(1, (0, type_graphql_1.Arg)('postId')),
    __param(2, (0, type_graphql_1.Arg)('assignDate')),
    __param(3, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, String, String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "moveAChallengePost", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __param(0, (0, type_graphql_1.Arg)('currentDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "getIngredientsStats", null);
__decorate([
    (0, type_graphql_1.Query)(() => IngredientStatsWithPortion_1.default),
    __param(0, (0, type_graphql_1.Arg)('currentDate')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __param(2, (0, type_graphql_1.Arg)('ingredientId')),
    __param(3, (0, type_graphql_1.Arg)('type', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "testGetIngredientsStats", null);
__decorate([
    (0, type_graphql_1.Query)(() => BlendNutrientStats_1.default),
    __param(0, (0, type_graphql_1.Arg)('currentDate')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __param(2, (0, type_graphql_1.Arg)('nutrientId')),
    __param(3, (0, type_graphql_1.Arg)('type', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "testGetNuteientsStats", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChallengePostResolver.prototype, "gobletOfFire", null);
ChallengePostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ChallengePostResolver);
exports.default = ChallengePostResolver;
