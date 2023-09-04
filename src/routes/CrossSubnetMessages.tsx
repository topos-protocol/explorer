import { Alert, Space } from 'antd'
import { useContext, useEffect } from 'react'

import RouteContainer from '../components/RouteContainer'
import CertificateGraph from '../components/CrossSubnetMessagesGraph'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'

const CrossSubnetMessages = () => {
  const { selectedTCEEndpoint, selectedToposSubnet } = useContext(
    SelectedNetworksContext
  )
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)

  useEffect(
    function setPageReady() {
      if (setRouteParamsProcessing) {
        setRouteParamsProcessing({ isReady: true })
      }
    },
    [setRouteParamsProcessing]
  )

  return (
    <RouteContainer breadcrumbItems={[{ title: 'Cross-Subnet Messages' }]}>
      <Space direction="vertical">
        {Boolean(selectedTCEEndpoint) && Boolean(selectedToposSubnet) ? (
          <CertificateGraph />
        ) : (
          <>
            {!Boolean(selectedTCEEndpoint) && (
              <Alert
                message="Please select a TCE endpoint first!"
                type="error"
              />
            )}
            {!Boolean(selectedToposSubnet) && (
              <Alert
                message="Please select a Topos Subnet endpoint first!"
                type="error"
              />
            )}
          </>
        )}
      </Space>
    </RouteContainer>
  )
}

export default CrossSubnetMessages
