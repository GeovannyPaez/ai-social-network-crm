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
import AiModel from "./AiModel";

@Table
class Assistant extends Model<Assistant> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    openaiApiKey: string;

    @Column
    name: string;

    @Column
    instructions: string;

    @Default(false)
    @Column
    isActivated: boolean;

    @Column // assistant or chat_completions
    type: string;

    @Column
    idAssistant: string;

    @Column
    maxTokens: number;

    @ForeignKey(() => User)
    @Column
    userParentId: number;

    @ForeignKey(() => AiModel)
    @Column
    modelId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => AiModel)
    model: AiModel;

}

export default Assistant;
