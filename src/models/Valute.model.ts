import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export class Valute extends Model {
  @PrimaryKey
  @Column
  id: string;

  @Column
  NumCode: number;

  @Column
  CharCode: string;

  @Column
  Nominal: number;

  @Column
  Name: string;

  @Column
  Value: number;

  @Column
  Previous: number;
}
