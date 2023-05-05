import React from 'react'
import { SubnetWithId } from '../types'

interface SelectedToposSubnetContext {
  setSelectedToposSubnet?: React.Dispatch<
    React.SetStateAction<SubnetWithId | undefined>
  >
  selectedToposSubnet?: SubnetWithId
}

export const SelectedToposSubnetContext =
  React.createContext<SelectedToposSubnetContext>({})
