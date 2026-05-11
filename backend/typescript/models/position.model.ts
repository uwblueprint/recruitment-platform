import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "positions" })
export default class Position extends Model {
  @Column({ type: DataType.STRING, allowNull: false, primaryKey: true })
  title!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isArchived!: boolean;
}
