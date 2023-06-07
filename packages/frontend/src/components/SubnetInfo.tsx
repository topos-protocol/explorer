import React, { useContext } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { Card, Col, Descriptions, Row, Space, Statistic, Table } from 'antd'
import useSubnetBlockInfo from '../hooks/useSubnetBlockInfo'
import useSubnetCertInfo from '../hooks/useSubnetCertInfo'

const SubnetInfo = () => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { blocks } = useSubnetBlockInfo(selectedSubnet)
  const { latestCertificate } = useSubnetCertInfo(selectedSubnet)

  return (
    <Space direction="vertical" size={30}>
      <Descriptions title="Info">
        <Descriptions.Item label="Name">
          {selectedSubnet?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Subnet Id" span={2}>
          {selectedSubnet?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Chain Id">
          {selectedSubnet?.chainId.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Currency">
          {selectedSubnet?.currencySymbol}
        </Descriptions.Item>
        <Descriptions.Item label="RPC Endpoint">
          {selectedSubnet?.endpoint}
        </Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Latest block" value={blocks[0]?.number} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Latest certificate"
              value={latestCertificate?.position}
            />
          </Card>
        </Col>
      </Row>
      <Table
        columns={[
          {
            dataIndex: 'number',
            key: 'number',
            title: 'Number',
          },
          { dataIndex: 'hash', key: 'hash', title: 'Hash' },
          {
            dataIndex: 'timestamp',
            key: 'date',
            title: 'Date',
            render: (timestamp) => new Date(timestamp * 1_000).toLocaleString(),
          },
          {
            dataIndex: 'transactions',
            key: 'transactions',
            title: 'Transactions',
            render: (transactions) => transactions.length,
          },
        ]}
        dataSource={blocks}
        rowKey="hash"
      />
    </Space>
  )
}

export default SubnetInfo
