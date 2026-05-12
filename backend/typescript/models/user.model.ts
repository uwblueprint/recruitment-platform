import { BelongsTo, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import FirebaseFile from "./firebaseFile.model";
import { Role } from "../types";
import ReviewedApplicantRecord from "./reviewedApplicantRecord.model";

@Table({ tableName: "users" })
export default class User extends Model {
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true })
  id!: number;

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
    references: { model: "positions", key: "title" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  position?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_archived!: boolean;

  @Column({ type: DataType.UUID, allowNull: true, references: { model: "firebase_files", key: "id" }, onDelete: "SET NULL", onUpdate: "CASCADE", defaultValue: null })
  profile_picture_file_id?: string;

  @BelongsTo(() => FirebaseFile, { foreignKey: "profile_picture_file_id", targetKey: "id" })
  profile_picture_file?: FirebaseFile;

  @HasMany(() => ReviewedApplicantRecord, { foreignKey: "reviewer_id", sourceKey: "id" })
  reviewed_applicant_records?: ReviewedApplicantRecord[];
}
