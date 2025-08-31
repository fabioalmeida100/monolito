import { Router } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";

export const clientRoute = Router();

clientRoute.post("/", async (req, res) => {
    try {
        const facade = ClientAdmFacadeFactory.create()
        const input = req.body
        const result = await facade.add(input)
        res.json(result)
    } catch (error) {
        res.status(400).json({ message: (error as Error).message })
    }
})
