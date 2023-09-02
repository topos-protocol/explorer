import { Space } from 'antd'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'
import useSubnetGetTransaction from '../hooks/useSubnetGetTransaction'
import SubnetTransactionInfo from '../components/SubnetTransactionInfo'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'

const SubnetTransaction = () => {
  const { subnetId, transactionHash } = useParams()
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { receipt, transaction } = useSubnetGetTransaction(
    selectedSubnet,
    transactionHash
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
        { title: 'Transaction' },
        { title: transactionHash },
      ]}
    >
      <Space direction="vertical">
        {Boolean(transaction) && (
          <SubnetTransactionInfo receipt={receipt} transaction={transaction} />
        )}
      </Space>
    </RouteContainer>
  )
}

export default SubnetTransaction
