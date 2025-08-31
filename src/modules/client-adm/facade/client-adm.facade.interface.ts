import Address from "../../@shared/domain/value-object/address"
import { AddClientOutputDto } from "../usecase/add-client/add-client.usecase.dto"

export interface AddClientFacadeInputDto {
  id?: string
  name: string
  email: string
  document: string
  address: Address
}

export interface FindClientFacadeInputDto {
  id: string
}

export interface FindClientFacadeOutputDto {
  id: string
  name: string
  email: string
  document: string
  address: Address
  createdAt: Date
  updatedAt: Date
}

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<AddClientOutputDto>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}
