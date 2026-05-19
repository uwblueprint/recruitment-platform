import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
// eslint-disable-next-line import/no-cycle -- Sequelize bidirectional association
import InterviewGroup from "./interviewGroup.model";
import User from "./user.model";
import { InterviewConflict } from "../types/interviewDelegation";
import InterviewedApplicantRecord from "./interviewedApplicantRecord.model";

@Table({ tableName: "interview_delegations" })
export default class InterviewDelegation extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    references: { model: "interviewed_applicant_records", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  interviewed_applicant_record_id!: string;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    references: { model: "users", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  interviewer_id!: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: { model: "interview_groups", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  group_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  interview_has_conflict?: InterviewConflict;

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

  @BelongsTo(() => InterviewedApplicantRecord, {
    foreignKey: "interviewed_applicant_record_id",
    targetKey: "id",
  })
  interviewed_applicant_record!: InterviewedApplicantRecord;

  @BelongsTo(() => User, {
    foreignKey: "interviewer_id",
    targetKey: "id",
  })
  interviewer!: User;

  @BelongsTo(() => InterviewGroup, {
    foreignKey: "group_id",
    targetKey: "id",
  })
  interview_group!: InterviewGroup;
}
