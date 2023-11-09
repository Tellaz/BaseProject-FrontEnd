import { boolean } from "yup"

export interface AuthModel {
  user: UserModel
  roles: string[]
}

export interface UserModel {
  idUsuario: number
  idAspNetUser: string
  idEmpresa: number
  idRepresentante?: number
  nome: string
  sobrenome: string
  nomeCompleto: string
  email: string
  cpf: string
  dataCadastro: string
  ativo: boolean
  nomeEmpresa: string
  logoDataUrl: string
  fotoDataUrl: string
  primeiroAcesso: boolean
  twoFactorEnabled: boolean
  telefone: string
}
