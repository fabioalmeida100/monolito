import { ProductModelAdm } from "../../../modules/product-adm/repository/product.model";
import { ProductModelCatalog } from "../../../modules/store-catalog/repository/product.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { app } from "../../api/express";
import request from "supertest";
import { sequelize } from "../../api/express";

describe("E2E test for checkout", () => {
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

    it("should create a checkout", async () => {
        await ClientModel.create({
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            document: "12345678901",
            address: "123 Main St, Anytown, USA",
            number: "123",
            street: "Main St",
            complement: "Apto 1",
            city: "Anytown",
            state: "USA",
            zipcode: "12345678901",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await ProductModelAdm.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
            stock: 10,
            purchasePrice: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await ProductModelCatalog.create({
            id: "1",
            name: "Product 1",
            description: "Description 1",
            salesPrice: 100,
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: "1",
                products: [{ productId: "1" }]
            });
            
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('products');
    });
    
    it("should not create a checkout with invalid client", async () => {
        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: "2",
                products: [{ productId: "1" }]
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Client not found');
    });
});
