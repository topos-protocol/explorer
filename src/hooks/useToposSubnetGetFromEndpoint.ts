import { useCallback, useContext } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { toposCoreContract } from '../contracts'
import { BigNumber, providers } from 'ethers'
import { sanitizeURLProtocol } from '../utils'

export default function useToposSubnetGetFromEndpoint() {
  const { setErrors } = useContext(ErrorsContext)

  const getToposSubnetFromEndpoint = useCallback(async (endpoint: string) => {
    if (endpoint) {
      try {
        const provider = new providers.JsonRpcProvider(
          sanitizeURLProtocol('http', endpoint)
        )
        const network = await provider.getNetwork()
        const chainId = network.chainId

        const contract = toposCoreContract.connect(provider)
        const subnetId = await contract.networkSubnetId()

        return {
          chainId: BigNumber.from(chainId.toString()),
          currencySymbol: 'TOPOS',
          endpoint,
          id: subnetId,
          logoURL: '/logo.svg',
          name: 'Topos Subnet',
        }
      } catch (error) {
        console.error(error)
        setErrors((e) => [
          ...e,
          `Error when fetching information from the selected Topos Subnet endpoint!`,
        ])
      }
    }
  }, [])

  return { getToposSubnetFromEndpoint }
}
