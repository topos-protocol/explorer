import { Alert, Space } from 'antd'
import { useContext, useEffect } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import CertificatesList from '../components/CertificatesList'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'

const Certificates = () => {
  const { selectedSubnet, selectedTCEEndpoint } = useContext(
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
    <RouteContainer breadcrumbItems={[{ title: 'Certificates' }]}>
      <Space direction="vertical">
        {Boolean(selectedTCEEndpoint) && Boolean(selectedSubnet) ? (
          <CertificatesList />
        ) : (
          <>
            {Boolean(!selectedTCEEndpoint) && (
              <Alert
                message="Please select a TCE endpoint first!"
                type="error"
              />
            )}
            {Boolean(!selectedSubnet) && (
              <Alert message="Please select a subnet first!" type="error" />
            )}
          </>
        )}
      </Space>
    </RouteContainer>
  )
}

export default Certificates
