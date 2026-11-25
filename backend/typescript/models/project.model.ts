import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
// eslint-disable-next-line import/no-cycle -- Sequelize bidirectional association
import UserTermRecord from "./userTermRecord.model";

@Table({ tableName: "projects" })
export default class Project extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  project_name!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_archived!: boolean;

  @HasMany(() => UserTermRecord, { foreignKey: "project_id" })
  user_term_records?: UserTermRecord[];
}
