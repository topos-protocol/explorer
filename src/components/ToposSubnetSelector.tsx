import { useContext, useCallback, useMemo, useState } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import NetworkSelector from './NetworkSelector'
import useToposSubnetGetFromEndpoint from '../hooks/useToposSubnetGetFromEndpoint'

const ToposSubnetSelector = () => {
  const [loading, setLoading] = useState(false)
  const { selectedToposSubnet, setSelectedSubnet, setSelectedToposSubnet } =
    useContext(SelectedNetworksContext)
  const { getToposSubnetFromEndpoint } = useToposSubnetGetFromEndpoint()
  const liveNetworkItems = useMemo(
    () => [import.meta.env.VITE_TOPOS_SUBNET_ENDPOINT_REMOTE_DEFAULT],
    []
  )
  const defaultCustomItems = useMemo(
    () => [import.meta.env.VITE_TOPOS_SUBNET_ENDPOINT_CUSTOM_DEFAULT],
    []
  )

  const onValueChange = useCallback(
    async (endpoint: string) => {
      if (endpoint && setSelectedToposSubnet) {
        setLoading(true)

        const storedToposSubnetEndpoint = localStorage.getItem(
          'toposSubnetEndpoint'
        )
        if (storedToposSubnetEndpoint !== endpoint) {
          localStorage.setItem('toposSubnetEndpoint', endpoint)
        }

        getToposSubnetFromEndpoint(endpoint)
          .then((toposSubnet) => {
            setSelectedToposSubnet(toposSubnet)
          })
          .catch(() => {
            setSelectedToposSubnet(undefined)

            if (setSelectedSubnet) {
              setSelectedSubnet(undefined)
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    },
    [setSelectedToposSubnet, setSelectedSubnet]
  )

  return (
    <NetworkSelector
      allowCustomItems
      customItemsLabel="Custom"
      defaultCustomItems={defaultCustomItems.map((i) => ({
        label: i,
        value: i,
      }))}
      initialValue={
        selectedToposSubnet?.endpointWs || selectedToposSubnet?.endpointHttp
      }
      fixedItems={liveNetworkItems.map((i) => ({
        label: i,
        value: i,
      }))}
      fixedItemsLabel="Live networks"
      localStorageKeyCustomItems="topos-subnet-endpoints"
      loading={loading}
      onValueChange={onValueChange}
      selectPlaceholder="Select a Topos Subnet endpoint"
      title="Topos Subnet endpoint"
    />
  )
}

export default ToposSubnetSelector
