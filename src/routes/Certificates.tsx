import { Alert } from 'antd'
import React, { useContext } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import CertificatesList from '../components/CertificatesList'

const Certificates = () => {
  const { selectedTCEEndpoint } = useContext(SelectedNetworksContext)
  return (
    <RouteContainer breadcrumbItems={[{ title: 'Certificates' }]}>
      {Boolean(selectedTCEEndpoint) ? (
        <CertificatesList />
      ) : (
        <Alert message="Please select a TCE endpoint first!" type="error" />
      )}
    </RouteContainer>
  )
}

export default Certificates
