import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable("UserWhatsapps", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id"
                }
            },
            whatsappId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Whatsapps",
                    key: "id"
                }
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable("UserWhatsapps");
    }
};
