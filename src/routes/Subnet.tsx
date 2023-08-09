import { Alert, Space } from 'antd'
import { useContext } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetInfo from '../components/SubnetInfo'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'

const Subnet = () => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)

  return (
    <RouteContainer
      breadcrumbItems={[
        { title: 'Subnet' },
        { title: <SubnetNameAndLogo subnet={selectedSubnet} /> },
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
