import { useContext, useCallback, useMemo } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import NetworkSelector from './NetworkSelector'
import useToposSubnetGetFromEndpoint from '../hooks/useToposSubnetGetFromEndpoint'

const ToposSubnetSelector = () => {
  const { selectedToposSubnet, setSelectedToposSubnet } = useContext(
    SelectedNetworksContext
  )
  const { getToposSubnetFromEndpoint } = useToposSubnetGetFromEndpoint()
  const testnetItems = useMemo(
    () => ['rpc.topos-subnet.testnet-1.topos.technology'],
    []
  )
  const defaultCustomItems = useMemo(() => ['localhost:10002'], [])

  const onValueChange = useCallback(
    async (endpoint: string) => {
      if (endpoint && setSelectedToposSubnet) {
        const storedToposSubnetEndpoint = localStorage.getItem(
          'toposSubnetEndpoint'
        )
        if (storedToposSubnetEndpoint !== endpoint) {
          localStorage.setItem('toposSubnetEndpoint', endpoint)
        }

        const toposSubnet = await getToposSubnetFromEndpoint(endpoint)
        setSelectedToposSubnet(toposSubnet)
      }
    },
    [setSelectedToposSubnet]
  )

  return (
    <NetworkSelector
      allowCustomItems
      customItemsLabel="Dev"
      defaultCustomItems={defaultCustomItems.map((i) => ({
        label: i,
        value: i,
      }))}
      initialValue={selectedToposSubnet?.endpoint}
      fixedItems={testnetItems.map((i) => ({
        label: i,
        value: i,
      }))}
      fixedItemsLabel="Remote"
      localStorageKeyCustomItems="topos-subnet-endpoints"
      onValueChange={onValueChange}
      selectPlaceholder="Select a Topos Subnet endpoint"
      title="Topos Subnet endpoint"
    />
  )
}

export default ToposSubnetSelector
