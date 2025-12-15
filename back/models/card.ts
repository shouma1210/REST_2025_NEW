import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({tableName: 'cards'})

export class Card extends Model<Card> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    attribute!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    image?: File;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    modelNumber!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    moveName!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    moveDescription!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    status!: "Good" | "Average" | "Poor";

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    soldStatus!: "Sold" | "Available";
    
}