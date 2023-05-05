import { ethers } from 'ethers'
import React from 'react'

import { Subnet } from '../types'
import { SelectedToposSubnetContext } from '../contexts/selectedToposSubnet'

interface Args {
  subnet?: Subnet
  viaMetaMask?: boolean
}

export default function useEthers({ subnet }: Args = {}) {
  const { selectedToposSubnet } = React.useContext(SelectedToposSubnetContext)
  const provider = React.useMemo(() => {
    const endpoint = subnet?.endpoint || selectedToposSubnet?.endpoint

    return endpoint
      ? new ethers.providers.WebSocketProvider(`ws://${endpoint}/ws`)
      : undefined
  }, [subnet])

  return {
    provider,
  }
}
