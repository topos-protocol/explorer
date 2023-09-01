import { Alert } from 'antd'
import { useContext, useEffect } from 'react'

import RouteContainer from '../components/RouteContainer'
import CertificateGraph from '../components/CrossSubnetMessagesGraph'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'

const CrossSubnetMessages = () => {
  const { selectedTCEEndpoint } = useContext(SelectedNetworksContext)
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
      {Boolean(selectedTCEEndpoint) ? (
        <CertificateGraph />
      ) : (
        <Alert message="Please select a TCE endpoint first!" type="error" />
      )}
    </RouteContainer>
  )
}

export default CrossSubnetMessages
