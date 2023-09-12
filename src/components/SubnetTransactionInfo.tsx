import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { Descriptions } from 'antd'
import { ethers } from 'ethers'
import { useContext } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import AddressInfo from './AddressInfo'
import Link from './Link'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import TransactionStatus from './TransactionStatus'

interface Props {
  receipt?: TransactionReceipt
  transaction?: TransactionResponse
}

const SubnetTransactionInfo = ({ receipt, transaction }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)

  return (
    <Descriptions>
      <Descriptions.Item label="From" span={3}>
        <AddressInfo address={transaction?.from} />
      </Descriptions.Item>
      <Descriptions.Item label="To" span={3}>
        <AddressInfo address={transaction?.to} />
      </Descriptions.Item>
      <Descriptions.Item label="Subnet">
        <SubnetNameAndLogo subnet={selectedSubnet} />
      </Descriptions.Item>
      <Descriptions.Item label="Hash" span={2}>
        {transaction?.hash}
      </Descriptions.Item>
      <Descriptions.Item label="Value">
        {`${ethers.utils.formatUnits(transaction?.value!)} ${
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
        <TransactionStatus status={receipt?.status} />
      </Descriptions.Item>
      <Descriptions.Item label="Gas Limit">
        {transaction?.gasLimit.toString()}
      </Descriptions.Item>
      <Descriptions.Item label="Gas Price">
        {transaction?.gasPrice?.toString()}
      </Descriptions.Item>
      <Descriptions.Item label="Confirmations">
        {transaction?.confirmations}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default SubnetTransactionInfo
