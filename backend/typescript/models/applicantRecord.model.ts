import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import {
  ApplicantRecordExtraInfo,
  ApplicationStatus,
  ApplicationStatusEnum,
  ShortAnswerQuestion,
  SkillCategory,
} from "../types";
import Applicant from "./applicant.model";

@Table({ tableName: "applicant_records" })
export default class ApplicantRecord extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: { model: "applicants", key: "id" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  applicant_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    references: { model: "positions", key: "title" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  position!: string;

  @Column({ type: DataType.ARRAY(DataType.JSONB), allowNull: false })
  role_specific_questions!: ShortAnswerQuestion[];

  @Column({ type: DataType.INTEGER, allowNull: false })
  choice!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: ApplicationStatusEnum.APPLIED,
  })
  status!: ApplicationStatus;

  @Column({ type: DataType.STRING, allowNull: true })
  skill_category?: SkillCategory;

  @Column({ type: DataType.JSONB, allowNull: true })
  extra_info?: ApplicantRecordExtraInfo;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  combined_score?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_applicant_flagged!: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_shortlisted_for_interview!: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_shortlisted_for_offer!: boolean;

  @BelongsTo(() => Applicant, { foreignKey: "applicant_id", targetKey: "id" })
  applicant!: Applicant;
}
