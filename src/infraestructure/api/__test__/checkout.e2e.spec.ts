import { ProductModelAdm } from "../../../modules/product-adm/repository/product.model";
import { ProductModelCatalog } from "../../../modules/store-catalog/repository/product.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { app } from "../../api/express";
import request from "supertest";
import { sequelize } from "../../api/express";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../../modules/invoice/repository/invoice-items.model";

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
        // Arrange
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

        // Act
        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: "1",
                products: [{ productId: "1" }]
            });

        // Assert
        const invoice = (await InvoiceModel.findAll({ include: [{ model: InvoiceItemsModel }] }));

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('products');
        expect(response.body.total).toBe(100);
        expect(response.body.products).toHaveLength(1);
        expect(response.body.products[0].productId).toBe("1"); 
        expect(invoice).toHaveLength(1);
        expect(invoice[0].id).toBe(response.body.invoiceId);
        expect(invoice[0].name).toBe("John Doe");
        expect(invoice[0].document).toBe("12345678901");
        expect(invoice[0].street).toBe("Main St");
        expect(invoice[0].number).toBe("123");
        expect(invoice[0].complement).toBe("Apto 1");
        expect(invoice[0].city).toBe("Anytown");
        expect(invoice[0].state).toBe("USA");
        expect(invoice[0].zipCode).toBe("12345678901");
        expect(invoice[0].items[0].invoiceId).toBe(response.body.invoiceId);
        expect(invoice[0].items[0].name).toBe("Product 1");
        expect(invoice[0].items[0].price).toBe(100);
        expect(invoice[0].items[0].id).toBe("1");
        expect(invoice[0].items[0].createdAt).toBeDefined();
        expect(invoice[0].items[0].updatedAt).toBeDefined();
    });
    
    it("should not create a checkout with invalid client", async () => {
        // Arrange
        const input = {
            clientId: "2",
            products: [{ productId: "1" }]
        }

        // Act
        const response = await request(app)
            .post("/checkout")
            .send(input);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Client not found');
    });
});
