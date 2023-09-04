import { useCallback, useContext } from 'react'
import { ErrorsContext } from '../contexts/errors'

import { Subnet } from '../types'
import { providers } from 'ethers'
import { sanitizeURLProtocol } from '../utils'

export default function useSubnetGetLatestBlockNumber() {
  const { setErrors } = useContext(ErrorsContext)

  const getSubnetLatestBlockNumber = useCallback((subnet?: Subnet) => {
    if (subnet) {
      try {
        const provider = new providers.JsonRpcProvider(
          sanitizeURLProtocol('http', subnet.endpoint)
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
