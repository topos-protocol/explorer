import styled from '@emotion/styled'
import { useCallback, useContext, useState } from 'react'

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
  Tag,
  Typography,
} from 'antd'

import useSubnetBlockInfo from '../hooks/useSubnetSubscribeToBlocks'
import useSubnetsCertificates from '../hooks/useSubnetsCertificates'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import { Link as _Link, useNavigate } from 'react-router-dom'
import { SubnetsContext } from '../contexts/subnets'
import { CaretRightOutlined } from '@ant-design/icons'

const Link = styled(_Link)`
  animation-duration: 0.5s;
  animation-name: animate-fade;
  animation-fill-mode: backwards;

  @keyframes animate-fade {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

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

const { Search } = Input
const { Text } = Typography

const PAGE_SIZE = 5

const SubnetInfo = () => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { data: subnets } = useContext(SubnetsContext)
  const { blocks } = useSubnetBlockInfo(selectedSubnet)
  const { certificates } = useSubnetsCertificates({
    sourceSubnetIds: selectedSubnet ? [selectedSubnet.id] : undefined,
  })
  const [currentPage, setCurrentPage] = useState(1)
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
            {/* <Statistic
              title="Latest certificate"
              value={latestCertificate?.position}
            /> */}
          </Card>
        </Col>
      </Row>
      <Row gutter={32}>
        <Col md={24} lg={12}>
          <Divider orientation="left" style={{ margin: '2rem 0' }}>
            Latest Blocks
          </Divider>
          <Search
            placeholder="Search block by hash or number"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <List
            dataSource={blocks}
            pagination={{
              position: 'bottom',
              align: 'start',
              onChange: (page) => {
                setCurrentPage(page)
              },
              pageSize: PAGE_SIZE,
            }}
            rowKey="hash"
            renderItem={(block, index) => (
              <Link to={`/subnet/block/${block.hash}`}>
                <Item
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
                    title={
                      <Space>
                        <Text>{block.number}</Text>
                        {currentPage === 1 && index === 0 ? (
                          <Tag color="gold">Latest</Tag>
                        ) : null}
                      </Space>
                    }
                    description={block.hash}
                  />
                </Item>
              </Link>
            )}
          />
        </Col>
        <Col md={24} lg={12}>
          <Divider orientation="left" style={{ margin: '2rem 0' }}>
            Latest Certificates
          </Divider>
          <Search
            placeholder="Search certificate by id"
            allowClear
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
          <List
            dataSource={certificates}
            pagination={{
              position: 'bottom',
              align: 'start',
              onChange: (page) => {
                setCurrentPage(page)
              },
              pageSize: PAGE_SIZE,
            }}
            rowKey="prevId"
            renderItem={(certificate, index) => (
              <Link to={`/certificates/${certificate.stateRoot}`}>
                <Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{certificate.id}</Text>
                        {currentPage === 1 && index === 0 ? (
                          <Tag color="gold">Latest</Tag>
                        ) : null}
                      </Space>
                    }
                    description={
                      <Space>
                        <Text>Target subnets:</Text>
                        {Boolean(certificate.targetSubnets.length) ? (
                          <Space>
                            <CaretRightOutlined />
                            {certificate.targetSubnets.map((subnetId) => (
                              <SubnetNameAndLogo
                                subnet={subnets?.find(
                                  (s) => s.id === subnetId.value
                                )}
                              />
                            ))}
                          </Space>
                        ) : (
                          <Tag>None</Tag>
                        )}
                      </Space>
                    }
                  />
                </Item>
              </Link>
            )}
          />
        </Col>
      </Row>
    </Space>
  )
}

export default SubnetInfo