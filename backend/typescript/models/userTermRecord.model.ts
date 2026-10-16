import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "user_term_records" })
export default class UserTermRecord extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  user_id!: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  project_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  position_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  term!: string;
}
