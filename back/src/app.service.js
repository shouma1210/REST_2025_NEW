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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const card_1 = require("./../models/card");
const card_instance_1 = require("./../models/card_instance");
let AppService = class AppService {
    constructor(cardModel, cardInstanceModel) {
        this.cardModel = cardModel;
        this.cardInstanceModel = cardInstanceModel;
    }
    pickStatus() {
        const r = Math.random();
        if (r < 0.2)
            return "Good";
        if (r < 0.8)
            return "Normal";
        return "Bad";
    }
    pickSales() {
        return Math.random() < 0.25 ? "Out of Stock" : "Available";
    }
    makeSerial(modelNumber) {
        const suffix = Math.random().toString(16).slice(2, 10).toUpperCase();
        return `${modelNumber}-${suffix}`;
    }
    calcPrice(status) {
        const base = (Math.floor(Math.random() * 21) + 10) * 100;
        const mult = status === "Good" ? 1.1 : status === "Normal" ? 1.0 : 0.9;
        const totalPrice = base * mult;
        return Math.round(totalPrice / 100) * 100;
    }
    listCards() {
        return this.cardModel.findAll({ order: [['id', 'ASC']] });
    }
    async getCard(id) {
        const card = await this.cardModel.findByPk(id, { include: [card_instance_1.CardInstance] });
        if (!card)
            throw new common_1.NotFoundException("card not found");
        return card;
    }
    listInstances(cardId) {
        return this.cardInstanceModel.findAll({ where: { cardId }, order: [['id', 'ASC']] });
    }
    async createCardWithInstances(input, count = 100) {
        const { name, attribute, image, modelNumber, moveName, moveDescription } = input !== null && input !== void 0 ? input : {};
        if (!name || !attribute || !image || !modelNumber || !moveName || !moveDescription) {
            throw new Error("missing required fields");
        }
        const card = await this.cardModel.create({ name, attribute, image, modelNumber, moveName, moveDescription });
        const instances = Array.from({ length: count }).map(() => {
            const status = this.pickStatus();
            const salesStatus = this.pickSales();
            const price = this.calcPrice(status);
            return { cardId: card.id, status, salesStatus, price, serialNumber: this.makeSerial(modelNumber) };
        });
        await this.cardInstanceModel.bulkCreate(instances);
        return { cardId: card.id, createdInstances: count };
    }
    async updateCard(id, body) {
        const card = await this.cardModel.findByPk(id);
        if (!card)
            throw new common_1.NotFoundException("card not found");
        await card.update(body);
        return card;
    }
    async deleteCard(id) {
        const card = await this.cardModel.findByPk(id);
        if (!card)
            throw new common_1.NotFoundException("card not found");
        // ★子（個体）も消す（FK制約が無いならこれでOK）
        await this.cardInstanceModel.destroy({ where: { cardId: id } });
        await card.destroy();
        return { deleted: true };
    }
    async createInstance(cardId, body) {
        const card = await this.cardModel.findByPk(cardId);
        if (!card)
            throw new common_1.NotFoundException("card not found");
        const { serialNumber, status, salesStatus, price } = body !== null && body !== void 0 ? body : {};
        if (!serialNumber || !status || !salesStatus || typeof price !== "number") {
            throw new common_1.BadRequestException("missing required fields for instance");
        }
        const inst = await this.cardInstanceModel.create({
            cardId,
            serialNumber,
            status,
            salesStatus,
            price,
        });
        return inst;
    }
    async updateInstance(instanceId, body) {
        const inst = await this.cardInstanceModel.findByPk(instanceId);
        if (!inst)
            throw new common_1.NotFoundException("instance not found");
        await inst.update(body);
        return inst;
    }
    async deleteInstance(instanceId) {
        const inst = await this.cardInstanceModel.findByPk(instanceId);
        if (!inst)
            throw new common_1.NotFoundException("instance not found");
        await inst.destroy();
        return { deleted: true };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(card_1.Card)),
    __param(1, (0, sequelize_1.InjectModel)(card_instance_1.CardInstance)),
    __metadata("design:paramtypes", [Object, Object])
], AppService);
