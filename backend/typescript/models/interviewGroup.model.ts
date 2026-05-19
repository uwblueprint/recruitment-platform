import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import {
  InterviewGroupStatus,
  InterviewGroupStatusEnum,
} from "../types/interviewGroup";
// eslint-disable-next-line import/no-cycle -- Sequelize bidirectional association
import InterviewDelegation from "./interviewDelegation.model";

@Table({ tableName: "interview_groups" })
export default class InterviewGroup extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  scheduling_link?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: InterviewGroupStatusEnum.AVAILABILITY_PENDING,
  })
  status!: InterviewGroupStatus;

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

  @HasMany(() => InterviewDelegation, { foreignKey: "group_id" })
  interview_delegations?: InterviewDelegation[];
}
