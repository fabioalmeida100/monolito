import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.usecase.dto"
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.usecase.dto"

export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto>
  find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO>
}

