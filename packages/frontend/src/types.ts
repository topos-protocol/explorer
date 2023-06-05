import { BigNumber } from 'ethers'

// export interface Subnet {
//   chainId: BigNumber
//   currencySymbol: string
//   endpoint: string
//   logoURL: string
//   name: string
//   subnetId: string
// }

export interface Subnet {
  endpoint: string
  logoURL: string
  name: string
  currencySymbol: string
  chainId: BigNumber
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
