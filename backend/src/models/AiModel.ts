import { AutoIncrement, Column, CreatedAt, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import Assistant from "./Assistant";

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

    @HasMany(() => Assistant)
    assistants: Assistant[];
}

export default AiModel