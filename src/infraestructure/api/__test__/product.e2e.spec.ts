import request from "supertest";
import { app, sequelize } from "../express";

describe("E2E test for product", () => {
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
    
    it("should create a product", async () => {
        // Arrange
        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10,
        }

        // Act
        const productResponse = await request(app)
            .post("/product")
            .send(input);

        // Assert
        expect(productResponse.status).toBe(201);
        expect(productResponse.body.id).toBe("1");
        expect(productResponse.body.name).toBe("Product 1");
        expect(productResponse.body.description).toBe("Product 1 description");
        expect(productResponse.body.purchasePrice).toBe(100);
        expect(productResponse.body.stock).toBe(10);
    });
    
    it("try create a product with negative stock", async () => {
        // Arrange
        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: -1,
        }

        // Act
        const productResponse = await request(app)
            .post("/product")
            .send(input);

        // Assert
        expect(productResponse.status).toBe(400);
        expect(productResponse.body).toHaveProperty('message');
        expect(productResponse.body.message).toBe("Product stock cannot be negative");
    });
});
