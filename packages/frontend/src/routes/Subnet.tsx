import { Alert, Space } from 'antd'
import React, { useContext } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetInfo from '../components/SubnetInfo'

const Subnet = () => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)

  return (
    <RouteContainer breadcrumbItems={[{ title: 'Subnet' }]}>
      <Space direction="vertical" size={40}>
        {Boolean(selectedSubnet) ? (
          <SubnetInfo />
        ) : (
          <Alert message="Please select a subnet first!" type="error" />
        )}
      </Space>
    </RouteContainer>
  )
}

export default Subnet
