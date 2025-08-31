import { Router } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRoute = Router();

invoiceRoute.get("/:id", async (req, res) => {
    try {
        const facade = InvoiceFacadeFactory.create()
        const input = { id: req.params.id }
        const result = await facade.find(input)
        res.json(result)
    } catch (error) {
        res.status(400).json({ message: (error as Error).message })
    }
})
