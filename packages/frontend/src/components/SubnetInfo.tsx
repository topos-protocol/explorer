import styled from '@emotion/styled'
import { useCallback, useContext } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import {
  Card,
  Col,
  Descriptions,
  Divider,
  Input,
  List,
  Row,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd'

import useSubnetBlockInfo from '../hooks/useSubnetSubscribeToBlocks'
import useSubnetCertInfo from '../hooks/useSubnetCertInfo'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import { Link, useNavigate } from 'react-router-dom'

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

const { Search } = Input
const { Text } = Typography

const PAGE_SIZE = 5

const SubnetInfo = () => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { blocks } = useSubnetBlockInfo(selectedSubnet)
  const { latestCertificate } = useSubnetCertInfo(selectedSubnet)
  const navigate = useNavigate()

  const handleSearch = useCallback((value: string) => {
    navigate(`/subnet/block/${value}`)
  }, [])

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Info
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Name">
          <SubnetNameAndLogo subnet={selectedSubnet} />
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
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Latest Blocks
      </Divider>
      <Search
        placeholder="Search block by hash or number"
        allowClear
        onSearch={handleSearch}
        style={{ width: 200 }}
      />
      <List
        dataSource={blocks}
        pagination={{ position: 'bottom', align: 'start', pageSize: PAGE_SIZE }}
        renderItem={(block) => (
          <Link to={`/subnet/block/${block.hash}`}>
            <Item
              key={block.hash}
              actions={[
                <Space key="list-vertical-tx">
                  <Text>{block.transactions.length.toString()}</Text>
                  <Text>tx</Text>
                </Space>,
                <Space key="list-vertical-date">
                  <Text>
                    {new Date(block.timestamp * 1_000).toLocaleString()}
                  </Text>
                </Space>,
              ]}
            >
              <List.Item.Meta
                title={`#${block.number}`}
                description={block.hash}
              />
            </Item>
          </Link>
        )}
      />
    </Space>
  )
}

export default SubnetInfo
