import { Alert } from 'antd'
import React, { useContext } from 'react'

import RouteContainer from '../components/RouteContainer'
import CertificateGraph from '../components/CrossSubnetMessagesGraph'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'

const CrossSubnetMessages = () => {
  const { selectedTCEEndpoint } = useContext(SelectedNetworksContext)
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
