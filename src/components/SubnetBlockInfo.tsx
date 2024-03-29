import { CaretRightOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import {
  Card,
  Col,
  Descriptions,
  Divider,
  List,
  Row,
  Space,
  Statistic,
  Typography,
} from 'antd'
import { Block, formatUnits } from 'ethers'
import { useContext } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import Link from './Link'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import AddressInfo from './AddressInfo'

const { Text } = Typography

const Item = styled(List.Item)`
  padding-left: 0.5rem !important;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colorBgContainer};
  }

  .ant-list-item-meta-title {
    transition: color 0.4s ease;
  }

  &:hover .ant-list-item-meta-title {
    color: ${({ theme }) => theme.colorPrimary} !important;
  }
`

const PAGE_SIZE = 10

interface Props {
  blockWithTransactions?: Block
}

const SubnetBlockInfo = ({ blockWithTransactions }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)

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
        <Descriptions.Item label="Parent hash" span={2}>
          <Link
            to={`/subnet/${selectedSubnet?.id}/block/${blockWithTransactions?.parentHash}`}
          >
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
        dataSource={blockWithTransactions?.prefetchedTransactions}
        pagination={{
          position: 'bottom',
          align: 'start',
          pageSize: PAGE_SIZE,
        }}
        rowKey="hash"
        renderItem={(transaction, index) => (
          <Link
            to={`/subnet/${selectedSubnet?.id}/transaction/${transaction.hash}`}
          >
            <Item
              actions={[
                <Space key="list-vertical-date">
                  <Text>{`${formatUnits(transaction.value)} ${
                    selectedSubnet?.currencySymbol
                  }`}</Text>
                </Space>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text>
                      #{index} | {transaction.hash}
                    </Text>
                  </Space>
                }
                description={
                  <Space>
                    <AddressInfo address={transaction.from} />
                    <CaretRightOutlined />
                    <AddressInfo address={transaction.to || undefined} />
                  </Space>
                }
              />
            </Item>
          </Link>
        )}
      />
    </Space>
  )
}

export default SubnetBlockInfo
