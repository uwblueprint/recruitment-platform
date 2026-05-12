import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "firebase_files" })
export default class FirebaseFile extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  storage_path!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  original_file_name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  uploaded_user_id!: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  size_bytes!: number;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  updatedAt!: Date;
}
