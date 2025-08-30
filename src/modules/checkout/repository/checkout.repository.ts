import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import { ClientOrderModel } from "./client-order.model";
import { OrderModel } from "./order.model";
import { ProductOrderModel } from "./product-order.model";
import CheckoutGateway from "../gateway/checkout.gateway";
import Id from "../../@shared/domain/value-object/id.value-object";

export class CheckoutRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        // Criar o pedido primeiro
        const orderModel = await OrderModel.create({
            id: order.id.id,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        })

        await ClientOrderModel.create({
            id: order.client.id.id,
            name: order.client.name,
            email: order.client.email,
            address: order.client.address,
            orderId: order.id.id,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        if (order.products.length > 0) {
            await Promise.all(order.products.map(product => 
                ProductOrderModel.create({
                    id: product.id.id,
                    name: product.name,
                    description: product.description,
                    salesPrice: product.salesPrice,
                    orderId: order.id.id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            ))
        }
    }

    async findOrder(id: string): Promise<Order | null> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: [
                { model: ClientOrderModel, as: 'client' },
                { model: ProductOrderModel, as: 'products' }
            ]
        })

        if (!orderModel) {
            return null
        }

        const client = new Client({
            id: new Id(orderModel.client.id),
            name: orderModel.client.name,
            email: orderModel.client.email,
            address: orderModel.client.address
        })

        const products = orderModel.products.map(productModel => 
            new Product({
                id: new Id(productModel.id),
                name: productModel.name,
                description: productModel.description,
                salesPrice: productModel.salesPrice
            })
        )

        return new Order({
            id: new Id(orderModel.id),
            client,
            products,
            status: orderModel.status
        })
    }
}
