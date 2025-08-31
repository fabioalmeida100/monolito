import { Router } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRoute = Router();

productRoute.post("/", async (req, res) => {
    try {
        const productAdmFacade = ProductAdmFacadeFactory.create();
        const input = req.body;
        const result = await productAdmFacade.addProduct(input);

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
});
