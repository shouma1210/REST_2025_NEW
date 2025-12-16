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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardInstance = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const card_1 = require("./card");
let CardInstance = class CardInstance extends sequelize_typescript_1.Model {
};
exports.CardInstance = CardInstance;
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], CardInstance.prototype, "serialNumber", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("Good", "Normal", "Bad")),
    __metadata("design:type", String)
], CardInstance.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM("Out of Stock", "Available")),
    __metadata("design:type", String)
], CardInstance.prototype, "salesStatus", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], CardInstance.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => card_1.Card),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], CardInstance.prototype, "cardId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => card_1.Card),
    __metadata("design:type", card_1.Card)
], CardInstance.prototype, "card", void 0);
exports.CardInstance = CardInstance = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "card_instances" })
], CardInstance);
