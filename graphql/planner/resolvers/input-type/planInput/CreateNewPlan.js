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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const CreatePlanData_1 = __importDefault(require("./CreatePlanData"));
const ImageWithHashInput_1 = __importDefault(require("../ImageWithHashInput"));
// memberId: {
//   type: SchemaTypes.ObjectId,
//   ref: 'Member',
//   unique: true,
//   required: [true, 'Member ID is required'],
// },
// recipes: [{ type: SchemaTypes.ObjectId, ref: 'Recipe' }],
// assignDate: Date,
// createdAt: { type: Date, default: Date.now() },
// updatedAt: Date,
let CreateNewPlan = class CreateNewPlan {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateNewPlan.prototype, "planName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateNewPlan.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateNewPlan.prototype, "startDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateNewPlan.prototype, "endDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], CreateNewPlan.prototype, "memberId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => ImageWithHashInput_1.default, { nullable: true }),
    __metadata("design:type", ImageWithHashInput_1.default)
], CreateNewPlan.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [CreatePlanData_1.default]),
    __metadata("design:type", Array)
], CreateNewPlan.prototype, "planData", void 0);
CreateNewPlan = __decorate([
    (0, type_graphql_1.InputType)()
], CreateNewPlan);
exports.default = CreateNewPlan;
