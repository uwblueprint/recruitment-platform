import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "../types";
import Position from "./position.model";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  first_name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  last_name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  auth_id!: string;

  @Column({
    type: DataType.ENUM("User", "Admin", "SuperAdmin"),
    allowNull: false,
  })
  role!: Role;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
    references: { model: Position, key: "title" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  position?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_archived!: boolean;
}
