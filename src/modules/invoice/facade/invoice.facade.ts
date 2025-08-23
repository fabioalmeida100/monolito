import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.usecase.dto"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../usecase/generate-invoice/generate-invoice.usecase.dto"
import InvoiceFacadeInterface from "./invoice.facade.interface"

export default class InvoiceFacade implements InvoiceFacadeInterface {
  constructor(
    private _generateInvoiceUseCase: GenerateInvoiceUseCase,
    private _findInvoiceUseCase: FindInvoiceUseCase
  ) {}

  async generate(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    return await this._generateInvoiceUseCase.execute(input)
  }

  async find(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    return await this._findInvoiceUseCase.execute(input)
  }
}

