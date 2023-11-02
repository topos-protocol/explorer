import { BigNumber, providers } from 'ethers'
import { useCallback, useContext } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { toposCoreContract } from '../contracts'
import { SubnetWithId } from '../types'

export default function useToposSubnetGetFromEndpoint() {
  const { setErrors } = useContext(ErrorsContext)

  const getToposSubnetFromEndpoint = useCallback(
    (endpoint: string) =>
      new Promise<SubnetWithId>(async (resolve, reject) => {
        if (endpoint) {
          try {
            const url = new URL(endpoint)
            const isURLWs = url.protocol.startsWith('ws')
            const provider = isURLWs
              ? new providers.WebSocketProvider(endpoint)
              : new providers.JsonRpcProvider(endpoint)

            const network = await provider.getNetwork()
            const chainId = network.chainId

            const contract = toposCoreContract.connect(provider)
            const subnetId = await contract.networkSubnetId()

            resolve({
              chainId: BigNumber.from(chainId.toString()),
              currencySymbol: 'TOPOS',
              endpointHttp: isURLWs ? '' : endpoint,
              endpointWs: isURLWs ? endpoint : '',
              id: subnetId,
              logoURL: '/logo.svg',
              name: 'Topos Subnet',
            })
          } catch (error) {
            console.error(error)
            setErrors((e) => [
              ...e,
              `Error when fetching information from the selected Topos Subnet endpoint!`,
            ])
            reject(error)
          }
        }
      }),
    []
  )

  return { getToposSubnetFromEndpoint }
}
