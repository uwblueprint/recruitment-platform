import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
// eslint-disable-next-line import/no-cycle -- Sequelize bidirectional association
import User from "./user.model";
import Project from "./project.model";

@Table({ tableName: "user_term_records" })
export default class UserTermRecord extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  user_id!: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: "projects",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  project_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    references: {
      model: "positions",
      key: "title",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  position_id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  term!: string;

  @BelongsTo(() => User, { foreignKey: "user_id", targetKey: "id" })
  user!: User;

  @BelongsTo(() => Project, { foreignKey: "project_id", targetKey: "id" })
  project!: Project;
}
