import {RequestMethod} from './_enums'

export interface RequestModel {
  method: RequestMethod
  endpoint: string
  data?: any
  queryObject?: any
  headers?: any
  ifSuccessRedirectTo?: string
  blockFree?: boolean
}

export interface FileModel {
  Nome: string
  Extensao: string
  Tamanho: number
  Tipo: string
  Base64: string
}

export const defaultRequestModel: Partial<RequestModel> = {
  data: null,
  queryObject: null,
  headers: null,
  ifSuccessRedirectTo: '',
}

export interface ISelectModel {
  Id: number              
  Nome: string 
  Texto?: string
}
