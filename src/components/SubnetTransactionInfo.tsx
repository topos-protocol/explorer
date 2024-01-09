import { Descriptions } from 'antd'
import { formatUnits, TransactionReceipt, TransactionResponse } from 'ethers'
import { useContext, useEffect, useState } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import AddressInfo from './AddressInfo'
import Link from './Link'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import TransactionStatus from './TransactionStatus'

interface Props {
  receipt?: TransactionReceipt | null
  transaction?: TransactionResponse | null
}

const SubnetTransactionInfo = ({ receipt, transaction }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const [confirmations, setConfirmations] = useState<number>()

  useEffect(
    function getConfirmations() {
      async function _() {
        transaction?.confirmations().then((confirmations) => {
          setConfirmations(confirmations)
        })
      }

      _()
    },
    [transaction]
  )

  return (
    <Descriptions>
      <Descriptions.Item label="From" span={3}>
        <AddressInfo address={transaction?.from} />
      </Descriptions.Item>
      <Descriptions.Item label="To" span={3}>
        <AddressInfo address={transaction?.to || undefined} />
      </Descriptions.Item>
      <Descriptions.Item label="Subnet">
        <SubnetNameAndLogo subnet={selectedSubnet} />
      </Descriptions.Item>
      <Descriptions.Item label="Hash" span={2}>
        {transaction?.hash}
      </Descriptions.Item>
      <Descriptions.Item label="Value">
        {`${formatUnits(transaction?.value!)} ${
          selectedSubnet?.currencySymbol
        }`}
      </Descriptions.Item>
      <Descriptions.Item label="Block" span={2}>
        <Link
          to={`/subnet/${selectedSubnet?.id}/block/${transaction?.blockHash}`}
        >
          {transaction?.blockHash}
        </Link>
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        <TransactionStatus status={receipt?.status || undefined} />
      </Descriptions.Item>
      <Descriptions.Item label="Gas Limit">
        {transaction?.gasLimit.toString()}
      </Descriptions.Item>
      <Descriptions.Item label="Gas Price">
        {transaction?.gasPrice?.toString()}
      </Descriptions.Item>
      <Descriptions.Item label="Confirmations">
        {confirmations}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default SubnetTransactionInfo
