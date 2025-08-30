import { Sequelize } from "sequelize-typescript"
import { CheckoutRepository } from "./checkout.repository"
import { ClientOrderModel } from "./client-order.model"
import { OrderModel } from "./order.model"
import { ProductOrderModel } from "./product-order.model"
import Order from "../domain/order.entity"
import Client from "../domain/client.entity"
import Product from "../domain/product.entity"
import Id from "../../@shared/domain/value-object/id.value-object"

describe("Checkout Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([ClientOrderModel, OrderModel, ProductOrderModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create an order with client and products", async () => {
    const clientId = new Id("client-1")
    const product1Id = new Id("product-1")
    const product2Id = new Id("product-2")
    const orderId = new Id("order-1")

    const client = new Client({
      id: clientId,
      name: "João Silva",
      email: "joao@teste.com",
      address: "Rua das Flores, 123, Centro, São Paulo, SP"
    })

    const product1 = new Product({
      id: product1Id,
      name: "Produto 1",
      description: "Descrição do produto 1",
      salesPrice: 100.00
    })

    const product2 = new Product({
      id: product2Id,
      name: "Produto 2",
      description: "Descrição do produto 2",
      salesPrice: 50.00
    })

    const order = new Order({
      id: orderId,
      client: client,
      products: [product1, product2],
      status: "pending"
    })

    const repository = new CheckoutRepository()
    await repository.addOrder(order)

    // Verificar se o cliente foi criado
    const clientDb = await ClientOrderModel.findOne({ where: { id: clientId.id } })
    expect(clientDb).toBeDefined()
    expect(clientDb.id).toEqual(client.id.id)
    expect(clientDb.name).toEqual(client.name)
    expect(clientDb.email).toEqual(client.email)
    expect(clientDb.address).toEqual(client.address)

    // Verificar se os produtos foram criados
    const product1Db = await ProductOrderModel.findOne({ where: { id: product1Id.id } })
    expect(product1Db).toBeDefined()
    expect(product1Db.id).toEqual(product1.id.id)
    expect(product1Db.name).toEqual(product1.name)
    expect(product1Db.description).toEqual(product1.description)
    expect(product1Db.salesPrice).toEqual(product1.salesPrice)

    const product2Db = await ProductOrderModel.findOne({ where: { id: product2Id.id } })
    expect(product2Db).toBeDefined()
    expect(product2Db.id).toEqual(product2.id.id)
    expect(product2Db.name).toEqual(product2.name)
    expect(product2Db.description).toEqual(product2.description)
    expect(product2Db.salesPrice).toEqual(product2.salesPrice)

    // Verificar se o pedido foi criado
    const orderDb = await OrderModel.findOne({ 
      where: { id: orderId.id },
      include: [
        { model: ClientOrderModel, as: 'client' },
        { model: ProductOrderModel, as: 'products' }
      ]
    })
    
    expect(orderDb).toBeDefined()
    expect(orderDb.id).toEqual(order.id.id)
    expect(orderDb.status).toEqual(order.status)
    expect(orderDb.client).toBeDefined()
    expect(orderDb.client.id).toEqual(client.id.id)
    expect(orderDb.products).toHaveLength(2)
    expect(orderDb.products[0].id).toEqual(product1.id.id)
    expect(orderDb.products[1].id).toEqual(product2.id.id)
  })

  it("should create an order with default status when not provided", async () => {
    const clientId = new Id("client-2")
    const productId = new Id("product-3")
    const orderId = new Id("order-2")

    const client = new Client({
      id: clientId,
      name: "Maria Santos",
      email: "maria@teste.com",
      address: "Av. Principal, 456, Bairro Novo, Rio de Janeiro, RJ"
    })

    const product = new Product({
      id: productId,
      name: "Produto Único",
      description: "Descrição do produto único",
      salesPrice: 75.50
    })

    const order = new Order({
      id: orderId,
      client: client,
      products: [product]
      // status não fornecido, deve usar o padrão "pending"
    })

    const repository = new CheckoutRepository()
    await repository.addOrder(order)

    const orderDb = await OrderModel.findOne({ where: { id: orderId.id } })
    expect(orderDb).toBeDefined()
    expect(orderDb.status).toEqual("pending")
  })

  it("should create an order with empty products array", async () => {
    const clientId = new Id("client-3")
    const orderId = new Id("order-3")

    const client = new Client({
      id: clientId,
      name: "Pedro Costa",
      email: "pedro@teste.com",
      address: "Rua do Comércio, 789, Centro, Belo Horizonte, MG"
    })

    const order = new Order({
      id: orderId,
      client: client,
      products: [],
      status: "created"
    })

    const repository = new CheckoutRepository()
    await repository.addOrder(order)

    const orderDb = await OrderModel.findOne({ 
      where: { id: orderId.id },
      include: [
        { model: ClientOrderModel, as: 'client' },
        { model: ProductOrderModel, as: 'products' }
      ]
    })
    
    expect(orderDb).toBeDefined()
    expect(orderDb.status).toEqual("created")
    expect(orderDb.client).toBeDefined()
    expect(orderDb.products).toHaveLength(0)
  })
})
