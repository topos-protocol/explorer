import React from 'react'

import { SubnetWithId } from '../types'

interface SelectedNetworksContext {
  setSelectedSubnet?: React.Dispatch<
    React.SetStateAction<SubnetWithId | undefined>
  >
  setSelectedToposSubnet?: React.Dispatch<
    React.SetStateAction<SubnetWithId | undefined>
  >
  setSelectedTCEEndpoint?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  selectedSubnet?: SubnetWithId
  selectedToposSubnet?: SubnetWithId
  selectedTCEEndpoint?: string
}

export const SelectedNetworksContext =
  React.createContext<SelectedNetworksContext>({})
