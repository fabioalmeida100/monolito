import { Sequelize } from "sequelize-typescript"
import Address from "../../@shared/domain/value-object/address"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemsModel } from "../repository/invoice-items.model"

describe("Invoice Facade unit test", () => {
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
    const facade = InvoiceFacadeFactory.create()

    const input = {
      name: "Invoice 1",
      document: "123456789",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100
        },
        {
          id: "2",
          name: "Item 2",
          price: 200
        }
      ]
    }

    const result = await facade.generate(input)
    
    let invoiceFromModel = await InvoiceModel.findOne({
      where: { id: result.id },
      include: [{ model: InvoiceItemsModel }]
    })

    expect(invoiceFromModel.id).toBeDefined()
    expect(invoiceFromModel.name).toEqual("Invoice 1")
    expect(invoiceFromModel.document).toEqual("123456789")
    expect(invoiceFromModel.street).toEqual("Rua 123")
    expect(invoiceFromModel.number).toEqual("99")
    expect(invoiceFromModel.complement).toEqual("Casa Verde")
    expect(invoiceFromModel.city).toEqual("Criciúma")
    expect(invoiceFromModel.state).toEqual("SC")
    expect(invoiceFromModel.zipCode).toEqual("88888-888")
    expect(invoiceFromModel.items).toHaveLength(2)
    expect(invoiceFromModel.items[0].name).toEqual("Item 1")
    expect(invoiceFromModel.items[0].price).toEqual(100)
    expect(invoiceFromModel.items[1].name).toEqual("Item 2")
    expect(invoiceFromModel.items[1].price).toEqual(200)
    expect(invoiceFromModel.items.reduce((total, item) => total + item.price, 0)).toEqual(result.total)
  })

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create()

    const generateInput = {
      name: "Invoice 1",
      document: "123456789",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100
        },
        {
          id: "2",
          name: "Item 2",
          price: 200
        }
      ]
    }

    const generatedInvoice = await facade.generate(generateInput)

    const findInput = {
      id: generatedInvoice.id
    }

    const result = await facade.find(findInput)

    expect(result.id).toEqual(generatedInvoice.id)
    expect(result.name).toEqual("Invoice 1")
    expect(result.document).toEqual("123456789")
    expect(result.address.street).toEqual("Rua 123")
    expect(result.address.number).toEqual("99")
    expect(result.address.complement).toEqual("Casa Verde")
    expect(result.address.city).toEqual("Criciúma")
    expect(result.address.state).toEqual("SC")
    expect(result.address.zipCode).toEqual("88888-888")
    expect(result.items).toHaveLength(2)
    expect(result.items[0].name).toEqual("Item 1")
    expect(result.items[0].price).toEqual(100)
    expect(result.items[1].name).toEqual("Item 2")
    expect(result.items[1].price).toEqual(200)
    expect(result.total).toEqual(300)
    expect(result.createdAt).toBeDefined()
  })
})
