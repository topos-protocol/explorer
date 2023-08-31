import { Dispatch, SetStateAction, createContext } from 'react'

import { SubnetWithId } from '../types'

interface SelectedNetworksContext {
  setSelectedSubnet?: Dispatch<SetStateAction<SubnetWithId | undefined>>
  setSelectedToposSubnet?: Dispatch<SetStateAction<SubnetWithId | undefined>>
  setSelectedTCEEndpoint?: Dispatch<SetStateAction<string | undefined>>
  selectedSubnet?: SubnetWithId
  selectedToposSubnet?: SubnetWithId
  selectedTCEEndpoint?: string
}

export const SelectedNetworksContext = createContext<SelectedNetworksContext>(
  {}
)
