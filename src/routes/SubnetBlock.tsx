import { useContext, useEffect } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetBlockInfo from '../components/SubnetBlockInfo'
import { Space } from 'antd'
import { useParams } from 'react-router-dom'
import useSubnetGetBlock from '../hooks/useSubnetGetBlock'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import { ErrorsContext } from '../contexts/errors'

const SubnetBlock = () => {
  const { blockHashOrNumber, subnetId } = useParams()
  const { setErrors } = useContext(ErrorsContext)
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { block, errors } = useSubnetGetBlock(selectedSubnet, blockHashOrNumber)

  useEffect(
    function bubbleErrors() {
      setErrors((e) => [...e, ...errors])
    },
    [errors]
  )

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
        { title: 'Block' },
        { title: blockHashOrNumber },
      ]}
    >
      <Space direction="vertical">
        {Boolean(block) && <SubnetBlockInfo blockWithTransactions={block} />}
      </Space>
    </RouteContainer>
  )
}

export default SubnetBlock
