import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.addColumn("Contacts", "isAssistantActive", {
            type: DataTypes.BOOLEAN,
            allowNull: false, // Dependiendo de tus requisitos, puedes cambiar esto a false si es obligatorio tener un padre
            defaultValue: false,
        });
    },
    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Contacts", "isAssistantActive");
    }
};
