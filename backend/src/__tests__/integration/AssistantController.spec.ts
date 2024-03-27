import supertest = require("supertest")
import faker from "faker"
import CreateUserService from "../../services/UserServices/CreateUserService";
import app from "../../app";
import { disconnect } from "../utils/database";
import { AsisstanCreateData } from "../../@types/assistant";

describe('AssistantController', () => {

    let tokenAuth: string;

    afterAll(async () => {
        await disconnect()
    })

    beforeAll(async () => {
        const user = await CreateUserService({
            email: faker.internet.email(),
            password: "123456",
            name: faker.name.findName()
        })
        const response = await supertest(app).post('/auth/login').send({
            email: user.email,
            password: "123456"
        })
        tokenAuth = response.body.token
    })


    test('should be able to create a new assistant', async () => {
        const assistanData: AsisstanCreateData = {
            name: faker.name.findName(),
            instructions: faker.lorem.sentence(),
            isActivate: true,
            userParentId: 0,
            modelId: 1,
            maxTokens: 50,
            type: "chat_completions"
        }

        const response = await supertest(app)
            .post('/assistants')
            .send(assistanData)
            .set('Authorization', `Bearer ${tokenAuth}`)
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name', assistanData.name)
    })

    test('should be able to list all assistants', async () => { })
})