import React, { useContext, useState } from 'react'

import SubnetSelector from '../components/SubnetSelector'
import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { SubnetWithId } from '../types'
import SubnetInfo from '../components/SubnetInfo'
import { Space } from 'antd'

const SubnetBlock = () => {
  const { selectedToposSubnet } = useContext(SelectedNetworksContext)
  const [selectedSubnet, setSelectedSubnet] = useState<SubnetWithId>()

  return (
    <RouteContainer breadcrumbItems={[{ title: 'Subnets' }]}>
      <Space direction="vertical" size={40}>
        <SubnetSelector disabled={!selectedToposSubnet} />
        {Boolean(selectedSubnet) && <SubnetInfo />}
      </Space>
    </RouteContainer>
  )
}

export default SubnetBlock
