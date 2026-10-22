import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import ApplicantRecord from "./applicantRecord.model";

@Table({ tableName: "positions" })
export default class Position extends Model {
  @Column({ type: DataType.STRING, allowNull: false, primaryKey: true })
  title!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  is_archived!: boolean;

  @HasMany(() => ApplicantRecord, {
    foreignKey: "position",
    sourceKey: "title",
  })
  applicant_records!: ApplicantRecord[];
}
