import { Space } from 'antd'
import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import RouteContainer from '../components/RouteContainer'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetNameAndLogo from '../components/SubnetNameAndLogo'
import useSubnetGetTransaction from '../hooks/useSubnetGetTransactionAndReceipt'
import SubnetTransactionView from '../components/SubnetTransaction'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import { ErrorsContext } from '../contexts/errors'

const SubnetTransaction = () => {
  const { subnetId, transactionHash } = useParams()
  const { setErrors } = useContext(ErrorsContext)
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { errors, receipt, transaction } = useSubnetGetTransaction(
    selectedSubnet,
    transactionHash
  )

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
        { title: 'Transaction' },
        { title: transactionHash },
      ]}
    >
      <Space direction="vertical">
        {Boolean(transaction) && (
          <SubnetTransactionView receipt={receipt} transaction={transaction} />
        )}
      </Space>
    </RouteContainer>
  )
}

export default SubnetTransaction
