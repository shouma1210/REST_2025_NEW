import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Card } from './../models/card';
import { CardInstance } from './../models/card_instance'; 

type Status = "Good" | "Normal" | "Bad";
type salesStatus = "Out of Stock" | "Available";

@Injectable()
export class AppService {
    constructor(
        @InjectModel(Card) private cardModel: typeof Card,
        @InjectModel(CardInstance) private cardInstanceModel: typeof CardInstance,
    ) {}

    private pickStatus(): Status {
        const r = Math.random();
        if (r < 0.2) return "Good";
        if (r < 0.8) return "Normal";
        return "Bad";
    }

    private pickSales(): salesStatus {
        return Math.random() < 0.25 ? "Out of Stock" : "Available";
    }

    private makeSerial(modelNumber: string): string {
        const suffix = Math.random().toString(16).slice(2,10).toUpperCase();
        return `${modelNumber}-${suffix}`;
    }

    private calcPrice(status: Status): number {
       const base = (Math.floor(Math.random() * 21) + 10) * 100;

       const mult = status === "Good" ? 1.1 : status === "Normal" ? 1.0 : 0.9;
       
       const totalPrice = base * mult;

       return Math.round(totalPrice / 100) * 100;
    }

    listCards() {
        return this.cardModel.findAll({ order: [['id', 'ASC']] });
    }


    async getCard(id: number) {
        const card = await this.cardModel.findByPk(id, { include: [CardInstance] });
        if (!card) throw new NotFoundException("card not found");
        return card;
    }

    listInstances(cardId: number) {
        return this.cardInstanceModel.findAll({ where: { cardId }, order: [['id', 'ASC']] });
    }

    async createCardWithInstances(input: any, count = 100) {
        const { name, attribute, image, modelNumber, moveName, moveDescription } = input ?? {};
        if (!name || !attribute || !image || !modelNumber || !moveName || !moveDescription) {
            throw new Error("missing required fields");
        }
    

        const card = await this.cardModel.create({ name, attribute, image, modelNumber, moveName, moveDescription }as any);
        const instances = Array.from({ length: count }).map(() => {
            const status = this.pickStatus();
            const salesStatus = this.pickSales();
            const price = this.calcPrice(status);
            return { cardId: card.id, status, salesStatus, price, serialNumber: this.makeSerial(modelNumber) };
        });

        await this.cardInstanceModel.bulkCreate(instances as any[]);
        return { cardId: card.id, createdInstances: count };
    }

    async updateCard(id: number, body: any) {
        const card = await this.cardModel.findByPk(id);
        if (!card) throw new NotFoundException("card not found");
        await card.update(body);
        return card;
    }

    async deleteCard(id: number) {
        const card = await this.cardModel.findByPk(id);
        if (!card) throw new NotFoundException("card not found");

        // ★子（個体）も消す（FK制約が無いならこれでOK）
        await this.cardInstanceModel.destroy({ where: { cardId: id } });
        await card.destroy();
        return { deleted: true };
    }

    async createInstance(cardId: number, body: any) {
        const card = await this.cardModel.findByPk(cardId);
        if (!card) throw new NotFoundException("card not found");

        const { serialNumber, status, salesStatus, price } = body ?? {};
        if (!serialNumber || !status || !salesStatus || typeof price !== "number") {
            throw new BadRequestException("missing required fields for instance");
        }
    }

    async updateInstance(instanceId: number, body: any) {
        const inst = await this.cardInstanceModel.findByPk(instanceId);
        if (!inst) throw new NotFoundException("instance not found");
        await inst.update(body);
        return inst;
    }

    async deleteInstance(instanceId: number) {
        const inst = await this.cardInstanceModel.findByPk(instanceId);
        if (!inst) throw new NotFoundException("instance not found");
        await inst.destroy();
        return { deleted: true };
    }

}