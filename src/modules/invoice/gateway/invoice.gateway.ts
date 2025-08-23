import Invoice from "../domain/invoice.entity"

export default interface InvoiceGateway {
  save(invoice: Invoice): Promise<void>
  find(id: string): Promise<Invoice>
}
