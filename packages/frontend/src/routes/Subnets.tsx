import React, { useContext, useState } from 'react'

import SubnetSelector from '../components/SubnetSelector'
import RouteContainer from '../components/RouteContainer'
import { SelectedSubnetContext } from '../contexts/selectedSubnet'
import { SelectedToposSubnetContext } from '../contexts/selectedToposSubnet'
import { SubnetWithId } from '../types'
import SubnetInfo from '../components/SubnetInfo'
import { Space } from 'antd'

const Subnets = () => {
  const { selectedToposSubnet } = useContext(SelectedToposSubnetContext)
  const [selectedSubnet, setSelectedSubnet] = useState<SubnetWithId>()

  return (
    <RouteContainer breadcrumbItems={[{ title: 'Subnets' }]}>
      <SelectedSubnetContext.Provider
        value={{ selectedSubnet, setSelectedSubnet }}
      >
        <Space direction="vertical" size={40}>
          <SubnetSelector disabled={!selectedToposSubnet} />
          {Boolean(selectedSubnet) && <SubnetInfo />}
        </Space>
      </SelectedSubnetContext.Provider>
    </RouteContainer>
  )
}

export default Subnets
