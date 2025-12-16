import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import {Card} from './card';

@Table({ tableName: "card_instances" })
export class CardInstance extends Model<CardInstance> {

  @Column(DataType.STRING)
  serialNumber!: string;

  @Column(DataType.ENUM("Good", "Normal", "Bad"))
  status!: "Good" | "Normal" | "Bad";

  @Column(DataType.ENUM("Out of Stock", "Available"))
  salesStatus!: "Out of Stock" | "Available";
  @Column(DataType.INTEGER)
  price!: number;

  @ForeignKey(() => Card)
  @Column({ type: DataType.INTEGER, allowNull: false })
  cardId!: number;

  @BelongsTo(() => Card)
  card!: Card;
}
