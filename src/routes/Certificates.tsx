import { Alert, Space } from 'antd'
import { useContext } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import CertificatesList from '../components/CertificatesList'

const Certificates = () => {
  const { selectedTCEEndpoint } = useContext(SelectedNetworksContext)
  return (
    <RouteContainer breadcrumbItems={[{ title: 'Certificates' }]}>
      <Space direction="vertical">
        {Boolean(selectedTCEEndpoint) ? (
          <CertificatesList />
        ) : (
          <Alert message="Please select a TCE endpoint first!" type="error" />
        )}
      </Space>
    </RouteContainer>
  )
}

export default Certificates
