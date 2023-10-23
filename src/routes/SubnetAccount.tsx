import { useContext, useEffect } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetAccountInfo from '../components/SubnetAccountInfo'
import { Space } from 'antd'
import { useParams } from 'react-router-dom'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'

const SubnetAccount = () => {
  const { accountAddress, subnetId } = useParams()
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)

  useEffect(
    function setSelectedSubnetFromParams() {
      if (subnetId && setRouteParamsProcessing) {
        setRouteParamsProcessing({ isReady: true, subnetId })
      }
    },
    [subnetId, setRouteParamsProcessing]
  )

  return (
    <RouteContainer
      breadcrumbItems={[
        { title: 'Subnet' },
        { title: <SubnetNameAndLogo subnet={selectedSubnet} /> },
        { title: 'Account' },
        { title: accountAddress },
      ]}
    >
      <Space direction="vertical">
        {accountAddress !== undefined && (
          <SubnetAccountInfo address={accountAddress} />
        )}
      </Space>
    </RouteContainer>
  )
}

export default SubnetAccount
