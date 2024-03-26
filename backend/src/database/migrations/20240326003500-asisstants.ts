import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable("Assistants", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            instructions: {
                type: DataTypes.STRING,
                allowNull: true // Opcional, según tus requisitos
            },
            isActivated: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            model: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            idAssistant: {
                type: DataTypes.STRING,
                allowNull: false
            },
            maxTokens: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            userParentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Users",
                    key: "id"
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable("Assistants");
    }
};
