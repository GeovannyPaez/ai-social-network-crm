import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.addColumn("Contacts", "isAssistantActive", {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
    },
    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Contacts", "isAssistantActive");
    }
};
