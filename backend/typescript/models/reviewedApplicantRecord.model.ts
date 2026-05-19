import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Review, ReviewStatus } from "../types";
// eslint-disable-next-line import/no-cycle -- Sequelize bidirectional association
import ApplicantRecord from "./applicantRecord.model";
import User from "./user.model";

@Table({ tableName: "reviewed_applicant_records" })
export default class ReviewedApplicantRecord extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: { model: "applicant_records", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    primaryKey: true,
  })
  applicant_record_id!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    primaryKey: true,
  })
  reviewer_id!: number;

  @Column({ type: DataType.JSONB, allowNull: true, defaultValue: null })
  review?: Review;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: "TODO" })
  status!: ReviewStatus;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  reviewer_has_conflict!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
  score?: number;

  @BelongsTo(() => User, { foreignKey: "reviewer_id", targetKey: "id" })
  reviewer!: User;

  @BelongsTo(() => ApplicantRecord, {
    foreignKey: "applicant_record_id",
    targetKey: "id",
  })
  applicant_record!: ApplicantRecord;
}
