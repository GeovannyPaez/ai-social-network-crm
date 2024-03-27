import { QueryInterface } from "sequelize";

//https://platform.openai.com/docs/models/overview
module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert(
            "AiModels",
            [
                {
                    name: "gpt-3.5-turbo-0125",
                    contextWindow: 16385,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "gpt-3.5-turbo-1106",
                    contextWindow: 16385,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "gpt-3.5-turbo",
                    contextWindow: 16385,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "gpt-4-1106-preview",
                    contextWindow: 128000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "gpt-4-0125-preview",
                    contextWindow: 128000,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ],
            {}
        );
    },

    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete("AiModels", {});
    }
};
