import { useContext, useEffect } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetCertificateInfo from '../components/SubnetCertificateInfo'
import { Space } from 'antd'
import { useParams } from 'react-router-dom'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import useSubnetGetCertificates from '../hooks/useSubnetGetCertificates'

const SubnetCertificate = () => {
  const { certificatePositionOrId, subnetId } = useParams() // For now certificatePositionOrId is position only
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { certificates } = useSubnetGetCertificates({
    sourceStreamPosition: {
      position: certificatePositionOrId
        ? parseInt(certificatePositionOrId)
        : undefined,
      sourceSubnetId: { value: selectedSubnet?.id || '' },
    },
    limit: 1,
  })

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
        { title: certificatePositionOrId },
      ]}
    >
      <Space direction="vertical">
        {Boolean(certificates) && (
          <SubnetCertificateInfo certificate={certificates![0]} />
        )}
      </Space>
    </RouteContainer>
  )
}

export default SubnetCertificate
