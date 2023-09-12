import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/abstract-provider'
import { Collapse, Divider, Space } from 'antd'

import SubnetTransactionReceiptLogs from './SubnetTransactionReceiptLogs'
import SubnetTransactionData from './SubnetTransactionData'
import SubnetTransactionInfo from './SubnetTransactionInfo'

interface Props {
  receipt?: TransactionReceipt
  transaction?: TransactionResponse
}

const SubnetTransaction = ({ receipt, transaction }: Props) => (
  <Space direction="vertical">
    <Divider orientation="left" style={{ margin: '2rem 0' }}>
      Info
    </Divider>
    <SubnetTransactionInfo transaction={transaction} receipt={receipt} />
    {transaction?.data !== '0x' && (
      <>
        <Divider orientation="left" style={{ margin: '2rem 0' }}>
          Data
        </Divider>
        <SubnetTransactionData transaction={transaction} />
      </>
    )}
    {Boolean(receipt?.logs.length) && (
      <>
        <Divider orientation="left" style={{ margin: '2rem 0' }}>
          Logs
        </Divider>
        <Collapse
          items={[
            {
              key: 1,
              label: 'Logs',
              children: <SubnetTransactionReceiptLogs receipt={receipt} />,
            },
          ]}
        />
      </>
    )}
  </Space>
)

export default SubnetTransaction
