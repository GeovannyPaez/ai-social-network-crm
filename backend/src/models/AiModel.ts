import { AutoIncrement, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table
class AiModel extends Model<AiModel> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string;

    @Column
    contextWindow: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

}

export default AiModel