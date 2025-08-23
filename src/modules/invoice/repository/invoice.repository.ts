import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"
import Invoice from "../domain/invoice.entity"
import InvoiceItems from "../domain/invoice-items.entity"
import InvoiceGateway from "../gateway/invoice.gateway"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemsModel } from "./invoice-items.model"

export default class InvoiceRepository implements InvoiceGateway {
  async save(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      total: invoice.total,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt
    })

    for (const item of invoice.items) {
      await InvoiceItemsModel.create({
        id: item.id.id,
        invoiceId: invoice.id.id,
        name: item.name,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })
    }
  }

  async find(id: string): Promise<Invoice> {
    const invoiceModel = await InvoiceModel.findOne({
      where: { id },
      include: [{ model: InvoiceItemsModel, as: 'items' }]
    })
    
    if (!invoiceModel) {
      throw new Error("Invoice not found")
    }

    const address = new Address(
      invoiceModel.street,
      invoiceModel.number,
      invoiceModel.complement,
      invoiceModel.city,
      invoiceModel.state,
      invoiceModel.zipCode
    )

    const items = invoiceModel.items.map(item => 
      new InvoiceItems({
        id: new Id(item.id),
        name: item.name,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })
    )

    return new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address,
      items,
      createdAt: invoiceModel.createdAt,
      updatedAt: invoiceModel.updatedAt
    })
  }
}
