import { app } from "../../api/express";
import request from "supertest";
import { sequelize } from "../../api/express";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../../modules/invoice/repository/invoice-items.model";

describe("E2E test for invoice", () => {
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

    it("should create a invoice and get it", async () => {
        await InvoiceModel.create({
            id: "1",
            name: "Invoice 1",
            document: "123456789",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await InvoiceItemsModel.create({
            id: "1",
            invoiceId: "1",
            name: "Item 1",
            price: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        
        const invoiceResponse = await request(app)
            .get(`/invoice/1`)
            .send();
            
        expect(invoiceResponse.status).toBe(200);
        expect(invoiceResponse.body.id).toBe("1");
        expect(invoiceResponse.body.name).toBe("Invoice 1");
        expect(invoiceResponse.body.document).toBe("123456789");
        expect(invoiceResponse.body.address.street).toBe("Rua 123");
        expect(invoiceResponse.body.address.number).toBe("99");
        expect(invoiceResponse.body.address.complement).toBe("Casa Verde");
        expect(invoiceResponse.body.address.city).toBe("Criciúma");
        expect(invoiceResponse.body.address.state).toBe("SC");
        expect(invoiceResponse.body.address.zipCode).toBe("88888-888");
        expect(invoiceResponse.body.items).toHaveLength(1);
        expect(invoiceResponse.body.items[0].id).toBe("1");
        expect(invoiceResponse.body.items[0].name).toBe("Item 1");
        expect(invoiceResponse.body.items[0].price).toBe(100);
        expect(invoiceResponse.body.total).toBe(100);
    });
    
    it("should not find a invoice with invalid id", async () => {
        const invoiceResponse = await request(app)
            .get(`/invoice/2`)
            .send();
        expect(invoiceResponse.status).toBe(400);
        expect(invoiceResponse.body).toHaveProperty('message');
        expect(invoiceResponse.body.message).toBe("Invoice not found");
    });
});
