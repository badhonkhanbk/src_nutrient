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
const GlobalBookmarkEntity_1 = __importDefault(require("./GlobalBookmarkEntity"));
let ExternalBookmark = class ExternalBookmark {
};
__decorate([
    (0, type_graphql_1.Field)((type) => GlobalBookmarkEntity_1.default),
    __metadata("design:type", GlobalBookmarkEntity_1.default)
], ExternalBookmark.prototype, "entityId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ExternalBookmark.prototype, "link", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ExternalBookmark.prototype, "type", void 0);
ExternalBookmark = __decorate([
    (0, type_graphql_1.ObjectType)()
], ExternalBookmark);
exports.default = ExternalBookmark;
// entityId: {
//   type: Schema.Types.ObjectId,
//   refPath: 'onModel',
//   required: true,
// },
// onModel: {
//   type: String,
//   required: true,
//   enum: ['BlendIngredient', 'BlendNutrient'],
// },
// link: String,
// type: String,
