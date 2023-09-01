import { useContext, useCallback } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { SubnetsContext } from '../contexts/subnets'
import NetworkSelector from './NetworkSelector'
import SubnetNameAndLogo from './SubnetNameAndLogo'

const SubnetSelector = () => {
  const { selectedSubnet, setSelectedSubnet } = useContext(
    SelectedNetworksContext
  )
  const { data: subnets } = useContext(SubnetsContext)

  const onValueChange = useCallback(
    async (subnetId: string) => {
      if (subnetId && setSelectedSubnet) {
        const storedSubnetId = localStorage.getItem('subnetId')
        if (storedSubnetId !== subnetId) {
          localStorage.setItem('subnetId', subnetId)
        }

        setSelectedSubnet(subnets?.find((s) => s.id === subnetId))
      }
    },
    [subnets, setSelectedSubnet]
  )

  return (
    <NetworkSelector
      allowCustomItems={false}
      initialValue={selectedSubnet?.id}
      fixedItems={subnets?.map((s) => ({
        label: <SubnetNameAndLogo subnet={s} />,
        value: s.id,
      }))}
      fixedItemsLabel="Registered subnets"
      onValueChange={onValueChange}
      selectPlaceholder="Select subnet"
      title="Subnet"
    />
  )
}

export default SubnetSelector
