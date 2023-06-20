import { gql } from '@apollo/client'
import { BigNumber } from 'ethers'

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

export interface FetchData<T> {
  data?: T
  error?: Error
  loading?: boolean
}

export interface Certificate {}
