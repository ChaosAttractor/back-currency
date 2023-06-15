import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Currency extends Model {
  @ApiProperty({ example: 'R01235' })
  @PrimaryKey
  @Column
  id: string;

  @ApiProperty({ example: '840' })
  @Column
  NumCode: number;

  @ApiProperty({ example: 'USD' })
  @Column
  CharCode: string;

  @ApiProperty({ example: 1 })
  @Column
  Nominal: number;

  @ApiProperty({ example: 'Доллар США' })
  @Column
  Name: string;

  @ApiProperty({ example: 83.6405 })
  @Column
  Value: number;

  @ApiProperty({ example: 82.6417 })
  @Column
  Previous: number;
}
