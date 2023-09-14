import { useContext, useCallback, useMemo } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import NetworkSelector from './NetworkSelector'

const TCESelector = () => {
  const { selectedTCEEndpoint, setSelectedTCEEndpoint } = useContext(
    SelectedNetworksContext
  )
  const testnetItems = useMemo(
    () => [import.meta.env.VITE_TCE_ENDPOINT_REMOTE_DEFAULT],
    []
  )
  const defaultCustomItems = useMemo(
    () => [import.meta.env.VITE_TCE_ENDPOINT_CUSTOM_DEFAULT],
    []
  )

  const onValueChange = useCallback(
    async (endpoint: string) => {
      if (endpoint && setSelectedTCEEndpoint) {
        const storedTCEEndpoint = localStorage.getItem('tceEndpoint')
        if (storedTCEEndpoint !== endpoint) {
          localStorage.setItem('tceEndpoint', endpoint)
        }

        setSelectedTCEEndpoint(endpoint)
      }
    },
    [setSelectedTCEEndpoint]
  )

  return (
    <NetworkSelector
      allowCustomItems
      customItemsLabel="Custom"
      defaultCustomItems={defaultCustomItems.map((i) => ({
        label: i,
        value: i,
      }))}
      initialValue={selectedTCEEndpoint}
      fixedItems={testnetItems.map((i) => ({
        label: i,
        value: i,
      }))}
      fixedItemsLabel="Live networks"
      localStorageKeyCustomItems="tce-endpoints"
      onValueChange={onValueChange}
      selectPlaceholder="Select a TCE endpoint"
      title="TCE endpoint"
    />
  )
}

export default TCESelector
