import React, { useContext } from 'react'

import RouteContainer from '../components/RouteContainer'
import CertificateGraph from '../components/CertificateGraph'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { Alert } from 'antd'

const TCE = () => {
  const { selectedTCEEndpoint } = useContext(SelectedNetworksContext)
  return (
    <RouteContainer breadcrumbItems={[{ title: 'TCE' }]}>
      {Boolean(selectedTCEEndpoint) ? (
        <CertificateGraph />
      ) : (
        <Alert message="Please select a TCE endpoint first!" type="error" />
      )}
    </RouteContainer>
  )
}

export default TCE
