import { Column, DataType, Model, Table } from "sequelize-typescript";
import { TeamRole } from "../types";

@Table({ tableName: "team_members" })
export default class TeamMember extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  first_name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  last_name!: string;

  @Column({
    type: DataType.ENUM("PM", "DESIGNER", "PL", "DEVELOPER"),
    allowNull: false,
  })
  team_role!: TeamRole;
}
