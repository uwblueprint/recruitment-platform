import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Interview, InterviewStatus, InterviewStatusEnum } from "../types";
// eslint-disable-next-line import/no-cycle -- Sequelize bidirectional association
import ApplicantRecord from "./applicantRecord.model";
import FirebaseFile from "./firebaseFile.model";
// eslint-disable-next-line import/no-cycle -- Sequelize bidirectional association
import InterviewDelegation from "./interviewDelegation.model";

@Table({ tableName: "interviewed_applicant_records" })
export default class InterviewedApplicantRecord extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: "applicant_records",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  applicant_record_id!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  score?: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: null,
  })
  interview_json?: Interview;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: InterviewStatusEnum.NEEDS_REVIEW,
  })
  status!: InterviewStatus;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    references: {
      model: "firebase_files",
      key: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  interview_notes_id?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: null,
  })
  interview_date?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date;

  @BelongsTo(() => ApplicantRecord, {
    foreignKey: "applicant_record_id",
    targetKey: "id",
  })
  applicant_record!: ApplicantRecord;

  @BelongsTo(() => FirebaseFile, {
    foreignKey: "interview_notes_id",
    targetKey: "id",
  })
  interview_notes?: FirebaseFile;

  @HasMany(() => InterviewDelegation, {
    foreignKey: "interviewed_applicant_record_id",
  })
  interview_delegations?: InterviewDelegation[];
}
