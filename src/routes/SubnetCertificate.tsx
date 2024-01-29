import { isHexString } from 'ethers'
import { useContext, useEffect, useMemo } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetCertificateInfo from '../components/SubnetCertificateInfo'
import { Space } from 'antd'
import { useParams } from 'react-router-dom'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import useSubnetGetCertificates from '../hooks/useSubnetGetCertificates'
import useSubnetGetCertificateById from '../hooks/useSubnetGetCertificateById'

type CertificatePositionOrId = 'position' | 'id'

const SubnetCertificate = () => {
  const { certificatePositionOrId, subnetId } = useParams()
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)

  const typeOfCertificatePositionOrId = useMemo<
    CertificatePositionOrId | undefined
  >(() => {
    if (certificatePositionOrId == undefined) {
      return undefined
    }

    return isHexString(certificatePositionOrId) ? 'id' : 'position'
  }, [certificatePositionOrId])

  const { certificates: certificatesByPosition } = useSubnetGetCertificates({
    sourceStreamPosition: {
      position:
        certificatePositionOrId &&
        typeOfCertificatePositionOrId &&
        typeOfCertificatePositionOrId === 'position'
          ? parseInt(certificatePositionOrId)
          : Infinity,
      sourceSubnetId: selectedSubnet?.id || '',
    },
    limit: 1,
  })

  const { certificate: certificateById } = useSubnetGetCertificateById({
    certificateId:
      certificatePositionOrId &&
      typeOfCertificatePositionOrId &&
      typeOfCertificatePositionOrId === 'id'
        ? certificatePositionOrId
        : undefined,
    sourceSubnetId: selectedSubnet?.id,
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
        {certificatesByPosition !== undefined && (
          <SubnetCertificateInfo certificate={certificatesByPosition[0]} />
        )}
        {certificateById !== undefined && (
          <SubnetCertificateInfo certificate={certificateById} />
        )}
      </Space>
    </RouteContainer>
  )
}

export default SubnetCertificate
