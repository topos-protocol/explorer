import { ethers } from 'ethers'
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
  const { certificatePositionOrId, subnetId } = useParams() // For now certificatePositionOrId is position only
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)

  const typeOfCertificatePositionOrId = useMemo<
    CertificatePositionOrId | undefined
  >(() => {
    if (certificatePositionOrId == undefined) {
      return undefined
    }

    return ethers.utils.isHexString(certificatePositionOrId) ? 'id' : 'position'
  }, [certificatePositionOrId])

  const { certificates } = useSubnetGetCertificates({
    sourceStreamPosition: {
      position:
        certificatePositionOrId &&
        typeOfCertificatePositionOrId &&
        typeOfCertificatePositionOrId === 'id'
          ? parseInt(certificatePositionOrId)
          : undefined,
      sourceSubnetId: { value: selectedSubnet?.id || '' },
    },
    limit: 1,
  })

  const { certificate } = useSubnetGetCertificateById({
    certificateId:
      certificatePositionOrId &&
      typeOfCertificatePositionOrId &&
      typeOfCertificatePositionOrId === 'id'
        ? certificatePositionOrId
        : undefined,
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
        {(Boolean(certificates) || Boolean(certificate)) && (
          <SubnetCertificateInfo
            certificate={
              typeOfCertificatePositionOrId === 'id'
                ? certificate
                : certificates![0]
            }
          />
        )}
      </Space>
    </RouteContainer>
  )
}

export default SubnetCertificate
