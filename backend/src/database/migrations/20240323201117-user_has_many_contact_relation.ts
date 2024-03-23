import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.addColumn("Contacts", "userParentId", {
            type: DataTypes.INTEGER,
            allowNull: true, // Dependiendo de tus requisitos, puedes cambiar esto a false si es obligatorio tener un padre
            references: {
                model: "Users",
                key: "id"
            }
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn("Contacts", "userParentId");
    }
};
