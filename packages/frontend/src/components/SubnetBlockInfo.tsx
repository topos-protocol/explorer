import { BlockWithTransactions } from '@ethersproject/abstract-provider'
import {
  Card,
  Col,
  Descriptions,
  Divider,
  List,
  Row,
  Space,
  Statistic,
} from 'antd'
import { Transaction } from 'ethers'
import { useContext, useState } from 'react'

import Link from './Link'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetNameAndLogo from './SubnetNameAndLogo'

const PAGE_SIZE = 10

interface Props {
  blockWithTransactions?: BlockWithTransactions
}

const SubnetBlockInfo = ({ blockWithTransactions }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Info
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Number">
          {blockWithTransactions?.number}
        </Descriptions.Item>
        <Descriptions.Item label="Hash" span={2}>
          {blockWithTransactions?.hash}
        </Descriptions.Item>
        <Descriptions.Item label="Subnet">
          <SubnetNameAndLogo subnet={selectedSubnet} />
        </Descriptions.Item>
        <Descriptions.Item label="Parent" span={2}>
          <Link to={`/subnet/block/${blockWithTransactions?.parentHash}`}>
            {blockWithTransactions?.parentHash}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {blockWithTransactions
            ? new Date(blockWithTransactions.timestamp * 1_000).toLocaleString()
            : null}
        </Descriptions.Item>
        <Descriptions.Item label="Gas Limit">
          {blockWithTransactions?.gasLimit.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Gas Used">
          {blockWithTransactions?.gasUsed.toString()}
        </Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Number of transactions"
              value={blockWithTransactions?.transactions.length}
            />
          </Card>
        </Col>
      </Row>
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Transactions
      </Divider>
      <List
        grid={{ xs: 2, sm: 3, md: 4, lg: 4, xl: 5, xxl: 6 }}
        dataSource={blockWithTransactions?.transactions}
        pagination={{
          position: 'bottom',
          align: 'start',
          onChange: (page: number) => {
            setCurrentPage(page)
          },
          pageSize: PAGE_SIZE,
        }}
        renderItem={(tx: Transaction, index: number) =>
          tx.hash ? (
            <Link to={`/subnet/transaction/${tx.hash}`}>
              <List.Item style={{ marginBottom: 0 }}>
                <List.Item.Meta title={tx.hash} />
              </List.Item>
            </Link>
          ) : (
            <List.Item style={{ marginBottom: 0 }}>
              <Card
                size="small"
                title=" "
                type="inner"
                style={{ opacity: 0.5 }}
              >
                <p style={{ visibility: 'hidden' }}>bla</p>
                <p style={{ visibility: 'hidden' }}>bla</p>
                <p style={{ visibility: 'hidden' }}>bla</p>
              </Card>
            </List.Item>
          )
        }
      />
    </Space>
  )
}

export default SubnetBlockInfo
