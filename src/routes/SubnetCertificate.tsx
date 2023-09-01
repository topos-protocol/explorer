import { useContext, useEffect } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetBlockInfo from '../components/SubnetBlockInfo'
import { Space } from 'antd'
import { useParams } from 'react-router-dom'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'

const SubnetCertificate = () => {
  const { certificateId, subnetId } = useParams()
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
        { title: 'Certificate' },
        { title: certificateId },
      ]}
    >
      <Space direction="vertical">
        {Boolean(certificate) && (
          <SubnetCertificateInfo certificate={certificate} />
        )}
      </Space>
    </RouteContainer>
  )
}

export default SubnetCertificate
