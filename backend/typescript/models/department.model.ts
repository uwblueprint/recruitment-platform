import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import Position from "./position.model";

@Table({ tableName: "departments" })
export default class Department extends Model {
  @Column({ type: DataType.STRING, allowNull: false, primaryKey: true })
  slug!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @HasMany(() => Position, { foreignKey: "department", sourceKey: "slug" })
  positions?: Position[];
}
