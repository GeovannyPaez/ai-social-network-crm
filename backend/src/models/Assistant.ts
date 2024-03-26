import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
    Default,
} from "sequelize-typescript";
import User from "./User";

@Table
class Assistant extends Model<Assistant> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string;

    @Column
    instructions: string;

    @Column
    @Default(false)
    isActivated: boolean;

    @Column
    model: string;

    @Column // assistant or chat_completions
    type: string;

    @Column
    idAssistant: string;

    @Column
    maxTokens: number;

    @ForeignKey(() => User)
    @Column
    userParentId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @BelongsTo(() => User)
    user: User;

}

export default Assistant;
