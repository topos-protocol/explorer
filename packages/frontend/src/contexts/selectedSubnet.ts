import React from 'react'
import { SubnetWithId } from '../types'

interface SelectedSubnetContext {
  setSelectedSubnet?: React.Dispatch<React.SetStateAction<SubnetWithId | undefined>>
  selectedSubnet?: SubnetWithId
}

export const SelectedSubnetContext = React.createContext<SelectedSubnetContext>(
  {}
)
