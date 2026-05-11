import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "applicants" })
export default class Applicant extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  first_name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  last_name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  @Column({ type: DataType.ENUM("Academic", "Co-op"), allowNull: false })
  academic_or_coop!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  academic_year!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  heard_from!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  location_preference!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  program!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  pronouns!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  resume_url!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  times_applied!: number;

  @Column({ type: DataType.ARRAY(DataType.JSONB), allowNull: false })
  short_answer_questions!: { question: string; answer: string }[];

  @Column({ type: DataType.STRING, allowNull: false })
  term!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  submitted_at!: Date;
}
