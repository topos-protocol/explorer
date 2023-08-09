import { useContext } from 'react'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetBlockInfo from '../components/SubnetBlockInfo'
import { Space } from 'antd'
import { useParams } from 'react-router-dom'
import useSubnetGetBlock from '../hooks/useSubnetGetBlock'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'

const SubnetBlock = () => {
  const { blockHashOrNumber } = useParams()
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { block } = useSubnetGetBlock(selectedSubnet, blockHashOrNumber)

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
