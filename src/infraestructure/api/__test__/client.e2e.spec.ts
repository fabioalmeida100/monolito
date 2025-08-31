import request from "supertest";
import { app, sequelize } from "../express";
import Address from "../../../modules/@shared/domain/value-object/address";

describe("E2E test for client", () => {
    beforeAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterEach(async () => {
        await sequelize.truncate({ cascade: true });
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        await sequelize.close();
    });
   
    it("should create a client", async () => {
        let input = {
            id: "1",
            name: "Lucian",
            email: "lucian@xpto.com",
            document: "1234-5678",
            address: {
                street: "Rua 123",
                number: "99",
                complement: "Casa Verde",
                city: "Criciúma",
                state: "SC",
                zipCode: "88888-888"
            }
        }
        
        const clientResponse = await request(app)
            .post("/client")
            .send(input);

        expect(clientResponse.status).toBe(200);
        expect(clientResponse.body.id).toBe("1");
        expect(clientResponse.body.name).toBe("Lucian");
        expect(clientResponse.body.email).toBe("lucian@xpto.com");
        expect(clientResponse.body.document).toBe("1234-5678");
        expect(clientResponse.body.address.street).toBe("Rua 123");
        expect(clientResponse.body.address.number).toBe("99");
        expect(clientResponse.body.address.complement).toBe("Casa Verde");
        expect(clientResponse.body.address.city).toBe("Criciúma");
        expect(clientResponse.body.address.state).toBe("SC");
        expect(clientResponse.body.address.zipCode).toBe("88888-888");
        expect(clientResponse.body.createdAt).toBeDefined();
        expect(clientResponse.body.updatedAt).toBeDefined();
    });
    
    it("should not create a client with invalid payload", async () => {
        const clientResponse = await request(app)
            .post("/client")
            .send({ 
                id: "1",
                name: "Lucian",
                email: "lucian@xpto.com",
                document: "1234-5678",
                address: {
                    street: "Rua 123",
                    complement: "Casa Verde",
                    city: "Criciúma",
                    state: "SC",
                    zipCode: "88888-888"
                }
            });
        expect(clientResponse.status).toBe(400);
        expect(clientResponse.body).toHaveProperty('message');
        expect(clientResponse.body.message).toBe("notNull Violation: ClientModel.number cannot be null");
    });
});
