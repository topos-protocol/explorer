import { Alert, Space } from 'antd'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import SubnetBlocksList from '../components/SubnetBlocksList'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'

const Blocks = () => {
  const { subnetId } = useParams()
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)

  useEffect(
    function setPageReady() {
      if (setRouteParamsProcessing) {
        setRouteParamsProcessing({ isReady: true, subnetId })
      }
    },
    [setRouteParamsProcessing]
  )

  return (
    <RouteContainer
      breadcrumbItems={[
        { title: 'Subnet' },
        { title: <SubnetNameAndLogo subnet={selectedSubnet} /> },
        { title: 'Blocks' },
      ]}
    >
      <Space direction="vertical">
        {Boolean(selectedSubnet) ? (
          <SubnetBlocksList />
        ) : (
          <>
            {Boolean(!selectedSubnet) && (
              <Alert message="Please select a subnet first!" type="error" />
            )}
          </>
        )}
      </Space>
    </RouteContainer>
  )
}

export default Blocks
