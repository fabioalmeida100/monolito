import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn()
  }
}

describe("Generate Invoice use case unit test", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

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

    const result = await usecase.execute(input)

    expect(repository.save).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.document).toEqual(input.document)
    expect(result.street).toEqual(input.street)
    expect(result.number).toEqual(input.number)
    expect(result.complement).toEqual(input.complement)
    expect(result.city).toEqual(input.city)
    expect(result.state).toEqual(input.state)
    expect(result.zipCode).toEqual(input.zipCode)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].name).toEqual("Item 1")
    expect(result.items[0].price).toEqual(100)
    expect(result.items[1].name).toEqual("Item 2")
    expect(result.items[1].price).toEqual(200)
    expect(result.total).toEqual(300)
  })
})

