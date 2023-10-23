import { Alert, Space } from 'antd'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import CertificatesList from '../components/SubnetCertificatesList'
import RouteContainer from '../components/RouteContainer'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'

const Certificates = () => {
  const { subnetId } = useParams()
  const { selectedSubnet, selectedTCEEndpoint } = useContext(
    SelectedNetworksContext
  )
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
        { title: 'Certificates' },
      ]}
    >
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
