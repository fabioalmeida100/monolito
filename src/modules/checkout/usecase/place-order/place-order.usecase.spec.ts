import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.dto";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacade from "../../../store-catalog/facade/store-catalog.facade";
import CheckoutGateway from "../../gateway/checkout.gateway";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import Address from "../../../@shared/domain/value-object/address";

const MockClientFacade = (): jest.Mocked<ClientAdmFacadeInterface> => {
  return {
    add: jest.fn(),
    find: jest.fn()
  };
};

const MockProductFacade = (): jest.Mocked<ProductAdmFacadeInterface> => {
  return {
    addProduct: jest.fn(),
    checkStock: jest.fn()
  };
};

const MockCatalogFacade = (): any => {
  return {
    find: jest.fn(),
    findAll: jest.fn()
  };
};

const MockCheckoutGateway = (): jest.Mocked<CheckoutGateway> => {
  return {
    addOrder: jest.fn(),
    findOrder: jest.fn()
  };
};

const MockInvoiceFacade = (): jest.Mocked<InvoiceFacadeInterface> => {
  return {
    generate: jest.fn(),
    find: jest.fn()
  };
};

const MockPaymentFacade = (): jest.Mocked<PaymentFacadeInterface> => {
  return {
    process: jest.fn()
  };
};

describe("PlaceOrderUseCase unit tests", () => {
  let useCase: PlaceOrderUseCase;
  let clientFacade: jest.Mocked<ClientAdmFacadeInterface>;
  let productFacade: jest.Mocked<ProductAdmFacadeInterface>;
  let catalogFacade: any;
  let checkoutGateway: jest.Mocked<CheckoutGateway>;
  let invoiceFacade: jest.Mocked<InvoiceFacadeInterface>;
  let paymentFacade: jest.Mocked<PaymentFacadeInterface>;

  beforeEach(() => {
    clientFacade = MockClientFacade();
    productFacade = MockProductFacade();
    catalogFacade = MockCatalogFacade();
    checkoutGateway = MockCheckoutGateway();
    invoiceFacade = MockInvoiceFacade();
    paymentFacade = MockPaymentFacade();

    useCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      checkoutGateway,
      invoiceFacade,
      paymentFacade
    );
  });

  it("should place an order successfully", async () => {
    // Arrange
    const clientAddress = new Address(
      "Rua Teste",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "01234-567"
    );

    const input: PlaceOrderInputDto = {
      clientId: "client-1",
      products: [
        { productId: "product-1" },
        { productId: "product-2" }
      ]
    };

    clientFacade.find.mockResolvedValue({
      id: "client-1",
      name: "Cliente Teste",
      email: "cliente@teste.com",
      document: "12345678901",
      address: clientAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    productFacade.checkStock.mockResolvedValue({
      productId: "product-1",
      stock: 10
    });

    productFacade.checkStock.mockResolvedValueOnce({
      productId: "product-1",
      stock: 10
    }).mockResolvedValueOnce({
      productId: "product-2",
      stock: 5
    });

    catalogFacade.find.mockResolvedValueOnce({
      id: "product-1",
      name: "Produto 1",
      description: "Descrição do produto 1",
      salesPrice: 100
    }).mockResolvedValueOnce({
      id: "product-2",
      name: "Produto 2",
      description: "Descrição do produto 2",
      salesPrice: 200
    });

    paymentFacade.process.mockResolvedValue({
      transactionId: "transaction-1",
      orderId: "order-1",
      amount: 300,
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    invoiceFacade.generate.mockResolvedValue({
      id: "invoice-1",
      name: "Cliente Teste",
      document: "12345678901",
      street: "Rua Teste",
      number: "123",
      complement: "Apto 1",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      items: [
        {
          id: "product-1",
          name: "Produto 1",
          price: 100
        },
        {
          id: "product-2",
          name: "Produto 2",
          price: 200
        }
      ],
      total: 300
    });

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(clientFacade.find).toHaveBeenCalledWith({ id: "client-1" });
    expect(productFacade.checkStock).toHaveBeenCalledTimes(2);
    expect(catalogFacade.find).toHaveBeenCalledTimes(2);
    expect(paymentFacade.process).toHaveBeenCalledWith({
      orderId: expect.any(String),
      amount: 300
    });
    expect(invoiceFacade.generate).toHaveBeenCalledWith({
      name: "Cliente Teste",
      document: "12345678901",
      street: "Rua Teste",
      number: "123",
      complement: "Apto 1",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      items: [
        {
          id: "product-1",
          name: "Produto 1",
          price: 100
        },
        {
          id: "product-2",
          name: "Produto 2",
          price: 200
        }
      ]
    });
    expect(checkoutGateway.addOrder).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.total).toBe(300);
    expect(result.invoiceId).toBe("invoice-1");
    expect(result.products).toHaveLength(2);
    expect(result.products[0].productId).toBe("product-1");
    expect(result.products[1].productId).toBe("product-2");
  });

  it("should place an order with payment declined", async () => {
    // Arrange
    const clientAddress = new Address(
      "Rua Teste",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "01234-567"
    );

    const input: PlaceOrderInputDto = {
      clientId: "client-1",
      products: [{ productId: "product-1" }]
    };

    clientFacade.find.mockResolvedValue({
      id: "client-1",
      name: "Cliente Teste",
      email: "cliente@teste.com",
      document: "12345678901",
      address: clientAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    productFacade.checkStock.mockResolvedValue({
      productId: "product-1",
      stock: 10
    });

    catalogFacade.find.mockResolvedValue({
      id: "product-1",
      name: "Produto 1",
      description: "Descrição do produto 1",
      salesPrice: 100
    });

    paymentFacade.process.mockResolvedValue({
      transactionId: "transaction-1",
      orderId: "order-1",
      amount: 100,
      status: "declined",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(paymentFacade.process).toHaveBeenCalled();
    expect(invoiceFacade.generate).not.toHaveBeenCalled();
    expect(checkoutGateway.addOrder).toHaveBeenCalled();
    expect(result.invoiceId).toBeUndefined();
  });

  it("should throw error when client not found", async () => {
    // Arrange
    const input: PlaceOrderInputDto = {
      clientId: "client-1",
      products: [{ productId: "product-1" }]
    };

    clientFacade.find.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow("Client not found");
  });

  it("should throw error when no products selected", async () => {
    // Arrange
    const input: PlaceOrderInputDto = {
      clientId: "client-1",
      products: []
    };

    const clientAddress = new Address(
      "Rua Teste",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "01234-567"
    );

    clientFacade.find.mockResolvedValue({
      id: "client-1",
      name: "Cliente Teste",
      email: "cliente@teste.com",
      document: "12345678901",
      address: clientAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow("No products selected");
  });

  it("should throw error when product not found in stock check", async () => {
    // Arrange
    const clientAddress = new Address(
      "Rua Teste",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "01234-567"
    );

    const input: PlaceOrderInputDto = {
      clientId: "client-1",
      products: [{ productId: "product-1" }]
    };

    clientFacade.find.mockResolvedValue({
      id: "client-1",
      name: "Cliente Teste",
      email: "cliente@teste.com",
      document: "12345678901",
      address: clientAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    productFacade.checkStock.mockRejectedValue(new Error("Product not found"));

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow("Product with id product-1 not found");
  });

  it("should throw error when product has no stock", async () => {
    // Arrange
    const clientAddress = new Address(
      "Rua Teste",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "01234-567"
    );

    const input: PlaceOrderInputDto = {
      clientId: "client-1",
      products: [{ productId: "product-1" }]
    };

    clientFacade.find.mockResolvedValue({
      id: "client-1",
      name: "Cliente Teste",
      email: "cliente@teste.com",
      document: "12345678901",
      address: clientAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    productFacade.checkStock.mockResolvedValue({
      productId: "product-1",
      stock: 0
    });

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow("Product product-1 is not available in stock");
  });

  it("should throw error when product not found in catalog", async () => {
    // Arrange
    const clientAddress = new Address(
      "Rua Teste",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "01234-567"
    );

    const input: PlaceOrderInputDto = {
      clientId: "client-1",
      products: [{ productId: "product-1" }]
    };

    clientFacade.find.mockResolvedValue({
      id: "client-1",
      name: "Cliente Teste",
      email: "cliente@teste.com",
      document: "12345678901",
      address: clientAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    productFacade.checkStock.mockResolvedValue({
      productId: "product-1",
      stock: 10
    });

    catalogFacade.find.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow("Product not found");
  });
});
