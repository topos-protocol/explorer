import { Certificate as CertificateFromQuery } from './__generated__/graphql'

export interface Subnet {
  chainId: bigint
  currencySymbol: string
  endpointHttp: string
  endpointWs: string
  logoURL: string
  name: string
}

export interface SubnetWithId extends Subnet {
  id: string
}

export interface Token {
  addr: string
  symbol: string
}

export interface FetchData<T> {
  data?: T
  error?: Error
  loading?: boolean
}

export interface Certificate extends CertificateFromQuery {
  position?: number
}
