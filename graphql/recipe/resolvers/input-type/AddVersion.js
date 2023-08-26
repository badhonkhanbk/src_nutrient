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
const CreateIngredientData_1 = __importDefault(require("./CreateIngredientData"));
const ErrorIngredientInput_1 = __importDefault(require("./ErrorIngredientInput"));
let AddVersion = class AddVersion {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], AddVersion.prototype, "recipeId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], AddVersion.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddVersion.prototype, "selectedImage", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AddVersion.prototype, "postfixTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddVersion.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], AddVersion.prototype, "recipeInstructions", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], AddVersion.prototype, "servingSize", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [CreateIngredientData_1.default], { nullable: true }),
    __metadata("design:type", Array)
], AddVersion.prototype, "ingredients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ErrorIngredientInput_1.default], { nullable: true }),
    __metadata("design:type", Array)
], AddVersion.prototype, "errorIngredients", void 0);
AddVersion = __decorate([
    (0, type_graphql_1.InputType)()
], AddVersion);
exports.default = AddVersion;
