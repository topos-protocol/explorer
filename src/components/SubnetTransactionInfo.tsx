import styled from '@emotion/styled'
import {
  Card,
  Col,
  Collapse,
  Descriptions,
  Divider,
  List,
  Row,
  Space,
  Statistic,
  Typography,
} from 'antd'
import { Transaction, ethers } from 'ethers'
import { useContext, useState } from 'react'

import Link from './Link'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import { CaretRightOutlined } from '@ant-design/icons'
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/abstract-provider'

const { Text } = Typography

const Item = styled(List.Item)`
  padding-left: 0.5rem !important;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  animation-duration: 0.5s;
  animation-name: animate-slide;
  animation-fill-mode: backwards;

  &:hover {
    background-color: ${({ theme }) => theme.colorBgContainer};
  }

  .ant-list-item-meta-title {
    transition: color 0.4s ease;
  }

  &:hover .ant-list-item-meta-title {
    color: ${({ theme }) => theme.colorPrimary} !important;
  }

  @keyframes animate-slide {
    0% {
      transform: translateX(20px);
    }
    100% {
      transform: translateX(0);
    }
  }
`

const PAGE_SIZE = 10

interface Props {
  receipt?: TransactionReceipt
  transaction?: TransactionResponse
}

const SubnetTransactionInfo = ({ receipt, transaction }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  console.log(transaction)
  console.log(receipt)

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Info
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Value">
          {`${ethers.utils.formatUnits(transaction?.value!)} ${
            selectedSubnet?.currencySymbol
          }`}
        </Descriptions.Item>
        <Descriptions.Item label="Hash" span={2}>
          {transaction?.hash}
        </Descriptions.Item>
        <Descriptions.Item label="Subnet">
          <SubnetNameAndLogo subnet={selectedSubnet} />
        </Descriptions.Item>
        <Descriptions.Item label="Block" span={2}>
          <Link to={`/subnet/block/${transaction?.blockHash}`}>
            {transaction?.blockHash}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Gas Limit">
          {transaction?.gasLimit.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Gas Price">
          {transaction?.gasPrice?.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Data" span={3}>
          {transaction?.data}
        </Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Confirmations"
              value={transaction?.confirmations}
            />
          </Card>
        </Col>
      </Row>
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Logs
      </Divider>
      <List
        dataSource={receipt?.logs}
        pagination={{
          position: 'bottom',
          align: 'start',
          pageSize: PAGE_SIZE,
        }}
        rowKey="logIndex"
        renderItem={(log, index) => (
          <Item>
            <List.Item.Meta
              title={
                <Space>
                  <Text>#{log.logIndex}</Text>
                </Space>
              }
              description={
                <Space>
                  <Collapse
                    items={[
                      {
                        key: 1,
                        label: 'Data',
                        children: <Text>{log.data}</Text>,
                      },
                      {
                        key: 2,
                        label: 'Topics',
                        children: (
                          <Space direction="vertical">
                            {log.topics.map((t) => (
                              <Text>{t}</Text>
                            ))}
                          </Space>
                        ),
                      },
                    ]}
                    defaultActiveKey={['1']}
                  />
                </Space>
              }
            />
          </Item>
        )}
      />
    </Space>
  )
}

export default SubnetTransactionInfo
