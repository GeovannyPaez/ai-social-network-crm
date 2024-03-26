import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement,
  ForeignKey
} from "sequelize-typescript";
import User from "./User";

@Table
class Setting extends Model<Setting> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  openaiApiKey: string;

  @ForeignKey(() => User)
  @Column
  userParentId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Setting;
