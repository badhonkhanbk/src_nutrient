"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StapleListSchema = new mongoose_1.Schema({
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
        unique: true,
        required: [true, 'Member ID is required'],
    },
    list: [
        {
            ingredientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
            selectedPortion: String,
            quantity: Number,
            portions: [
                {
                    measurement: String,
                    measurement2: String,
                    meausermentWeight: String,
                    default: Boolean,
                    sourceId: String,
                },
            ],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});
const StapleList = (0, mongoose_1.model)('StapleList', StapleListSchema);
exports.default = StapleList;
