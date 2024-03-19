import {
    Table,
    Column,
    Model,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    AutoIncrement
} from "sequelize-typescript";
import User from "./User";
import Whatsapp from "./Whatsapp";

@Table
class UserWhatsapp extends Model<UserWhatsapp> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Whatsapp)
    @Column
    whatsappId: number;

    // Define las relaciones con los modelos User y Whatsapp
    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Whatsapp)
    whatsapp: Whatsapp;

    // Puedes añadir más columnas según tus necesidades
}

export default UserWhatsapp;
