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
const GIGl_1 = __importDefault(require("./GIGl"));
let NutrientsWithGiGl = class NutrientsWithGiGl {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], NutrientsWithGiGl.prototype, "nutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => GIGl_1.default, { nullable: true }),
    __metadata("design:type", GIGl_1.default)
], NutrientsWithGiGl.prototype, "giGl", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Number], { nullable: true }),
    __metadata("design:type", Array)
], NutrientsWithGiGl.prototype, "notFoundIndexes", void 0);
NutrientsWithGiGl = __decorate([
    (0, type_graphql_1.ObjectType)()
], NutrientsWithGiGl);
exports.default = NutrientsWithGiGl;
