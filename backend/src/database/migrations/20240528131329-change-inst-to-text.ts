import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.changeColumn("Assistants", "instructions", {
            type: DataTypes.TEXT,
            allowNull: true // Asegúrate de que esto siga siendo opcional según tus requisitos
        });
    },

    down: async (queryInterface: QueryInterface) => {
        // Revertir la columna a su estado anterior si es necesario
        await queryInterface.changeColumn("Assistants", "instructions", {
            type: DataTypes.STRING, // Asume que originalmente era STRING, ajusta si es diferente
            allowNull: true // Mantén esto consistente con el estado original
        });
    }
};
