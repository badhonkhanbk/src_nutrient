"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PlannerSchema = new mongoose_1.Schema({
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'Member ID is required'],
    },
    recipes: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: 'Recipe' }],
    assignDate: Date,
    formatedDate: String,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: Date,
});
const Planner = (0, mongoose_1.model)('Planner', PlannerSchema);
exports.default = Planner;
