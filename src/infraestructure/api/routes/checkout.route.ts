import { Router } from "express";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import { CheckoutRepository } from "../../../modules/checkout/repository/checkout.repository";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";


export const checkoutRoute = Router();

checkoutRoute.post("/", async (req, res) => {
    try {
        var useCase = new PlaceOrderUseCase(
            ClientAdmFacadeFactory.create(),
            ProductAdmFacadeFactory.create(),
            StoreCatalogFacadeFactory.create(),
            new CheckoutRepository(),
            InvoiceFacadeFactory.create(),
            PaymentFacadeFactory.create()
        );
        
        var input = {
            clientId: req.body.clientId,
            products: req.body.products
        }

        const result = await useCase.execute(input);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});


