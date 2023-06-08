import { Alert, Avatar, Space, Typography } from 'antd'
import React, { useContext } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetInfo from '../components/SubnetInfo'

const { Text } = Typography

const Subnet = () => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)

  return (
    <RouteContainer
      breadcrumbItems={[
        { title: 'Subnet' },
        {
          title: (
            <Space>
              <Avatar size="small" src={selectedSubnet?.logoURL} />
              <Text>{selectedSubnet?.name}</Text>
            </Space>
          ),
        },
      ]}
    >
      <Space direction="vertical">
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
