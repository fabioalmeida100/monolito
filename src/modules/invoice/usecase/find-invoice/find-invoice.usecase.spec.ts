import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/invoice.entity"
import InvoiceItems from "../../domain/invoice-items.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn()
  }
}

describe("Find Invoice use case unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

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
      id: new Id("1"),
      name: "Invoice 1",
      document: "123456789",
      address,
      items
    })

    repository.find.mockResolvedValue(invoice)

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalledWith("1")
    expect(result.id).toEqual("1")
    expect(result.name).toEqual("Invoice 1")
    expect(result.document).toEqual("123456789")
    expect(result.address.street).toEqual("Rua 123")
    expect(result.address.number).toEqual("99")
    expect(result.address.complement).toEqual("Casa Verde")
    expect(result.address.city).toEqual("Criciúma")
    expect(result.address.state).toEqual("SC")
    expect(result.address.zipCode).toEqual("88888-888")
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id).toEqual("1")
    expect(result.items[0].name).toEqual("Item 1")
    expect(result.items[0].price).toEqual(100)
    expect(result.items[1].id).toEqual("2")
    expect(result.items[1].name).toEqual("Item 2")
    expect(result.items[1].price).toEqual(200)
    expect(result.total).toEqual(300)
    expect(result.createdAt).toBeDefined()
  })
})
