import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "admin_comments" })
export default class AdminComment extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user_id!: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: { model: "applicant_records", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  applicant_record_id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  comment!: string;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updatedAt!: Date;
}
