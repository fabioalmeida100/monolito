import { Sequelize } from "sequelize-typescript"
import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"
import Invoice from "../domain/invoice.entity"
import InvoiceItems from "../domain/invoice-items.entity"
import InvoiceRepository from "./invoice.repository"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemsModel } from "./invoice-items.model"

describe("Invoice Repository unit test", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemsModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should generate an invoice", async () => {
    const repository = new InvoiceRepository()

    const address = new Address(
      "Rua 123",
      "99",
      "Casa Verde",
      "Criciúma",
      "SC",
      "88888-888"
    )

    const items = [
      new InvoiceItems({
        id: new Id("1"),
        name: "Item 1",
        price: 100
      }),
      new InvoiceItems({
        id: new Id("2"),
        name: "Item 2",
        price: 200
      })
    ]

    const invoice = new Invoice({
      name: "Invoice 1",
      document: "123456789",
      address,
      items
    })

    await repository.save(invoice)

    const savedInvoice = await InvoiceModel.findOne({ 
      where: { id: invoice.id.id },
      include: [{ model: InvoiceItemsModel, as: 'items' }]
    })
    
    expect(savedInvoice).toBeDefined()
    expect(savedInvoice.name).toEqual("Invoice 1")
    expect(savedInvoice.document).toEqual("123456789")
    expect(savedInvoice.street).toEqual("Rua 123")
    expect(savedInvoice.number).toEqual("99")
    expect(savedInvoice.complement).toEqual("Casa Verde")
    expect(savedInvoice.city).toEqual("Criciúma")
    expect(savedInvoice.state).toEqual("SC")
    expect(savedInvoice.zipCode).toEqual("88888-888")
    expect(savedInvoice.items).toHaveLength(2)
    expect(savedInvoice.items[0].name).toEqual("Item 1")
    expect(savedInvoice.items[0].price).toEqual(100)
    expect(savedInvoice.items[1].name).toEqual("Item 2")
    expect(savedInvoice.items[1].price).toEqual(200)

    const savedItems = await InvoiceItemsModel.findAll({ where: { invoiceId: invoice.id.id } })
    expect(savedItems).toHaveLength(2)
    expect(savedItems[0].name).toEqual("Item 1")
    expect(savedItems[0].price).toEqual(100)
    expect(savedItems[1].name).toEqual("Item 2")
    expect(savedItems[1].price).toEqual(200)
  })

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository()

    const address = new Address(
      "Rua 123",
      "99",
      "Casa Verde",
      "Criciúma",
      "SC",
      "88888-888"
    )

    const items = [
      new InvoiceItems({
        id: new Id("1"),
        name: "Item 1",
        price: 100
      }),
      new InvoiceItems({
        id: new Id("2"),
        name: "Item 2",
        price: 200
      })
    ]

    const invoice = new Invoice({
      name: "Invoice 1",
      document: "123456789",
      address,
      items
    })

    await repository.save(invoice)

    const foundInvoice = await repository.find(invoice.id.id)

    expect(foundInvoice.id.id).toEqual(invoice.id.id)
    expect(foundInvoice.name).toEqual("Invoice 1")
    expect(foundInvoice.document).toEqual("123456789")
    expect(foundInvoice.address.street).toEqual("Rua 123")
    expect(foundInvoice.address.number).toEqual("99")
    expect(foundInvoice.address.complement).toEqual("Casa Verde")
    expect(foundInvoice.address.city).toEqual("Criciúma")
    expect(foundInvoice.address.state).toEqual("SC")
    expect(foundInvoice.address.zipCode).toEqual("88888-888")
    expect(foundInvoice.items).toHaveLength(2)
    expect(foundInvoice.items[0].name).toEqual("Item 1")
    expect(foundInvoice.items[0].price).toEqual(100)
    expect(foundInvoice.items[1].name).toEqual("Item 2")
    expect(foundInvoice.items[1].price).toEqual(200)
  })

  it("should throw error when invoice not found", async () => {
    const repository = new InvoiceRepository()

    await expect(repository.find("invalid-id")).rejects.toThrow("Invoice not found")
  })
})
