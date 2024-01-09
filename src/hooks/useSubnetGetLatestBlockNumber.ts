import { getDefaultProvider } from 'ethers'
import { useCallback, useContext } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { Subnet } from '../types'

export default function useSubnetGetLatestBlockNumber() {
  const { setErrors } = useContext(ErrorsContext)

  const getSubnetLatestBlockNumber = useCallback((subnet?: Subnet) => {
    if (subnet) {
      try {
        const provider = getDefaultProvider(
          subnet.endpointHttp || subnet.endpointWs
        )
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
