import { providers } from 'ethers'
import { useCallback, useContext } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { Subnet } from '../types'

export default function useSubnetGetLatestBlockNumber() {
  const { setErrors } = useContext(ErrorsContext)

  const getSubnetLatestBlockNumber = useCallback((subnet?: Subnet) => {
    if (subnet) {
      try {
        const endpoint = subnet.endpointHttp || subnet.endpointWs
        const url = new URL(endpoint)
        const provider = url.protocol.startsWith('ws')
          ? new providers.WebSocketProvider(subnet.endpointWs)
          : new providers.JsonRpcProvider(subnet.endpointHttp)
        return provider.getBlockNumber()
      } catch (error) {
        setErrors((e) => [
          ...e,
          `Error when getting ${subnet.name}'s latest block number!`,
        ])
      }
    }
  }, [])

  return { getSubnetLatestBlockNumber }
}
