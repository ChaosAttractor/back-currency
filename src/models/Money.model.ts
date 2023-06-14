import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

// todo name
@Table
export class Money extends Model {
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
