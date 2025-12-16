import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: "cards" })
export class Card extends Model<Card> {
  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  attribute!: string;

  @Column(DataType.STRING)
  image!: string;

  @Column(DataType.STRING)
  modelNumber!: string;

  @Column(DataType.STRING)
  moveName!: string;

  @Column(DataType.TEXT)
  moveDescription!: string;
}
