import styled from '@emotion/styled'
import {
  Alert,
  Card,
  Col,
  Descriptions,
  Divider,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd'
import { useContext, useState } from 'react'

import { BlocksContext } from '../contexts/blocks'
import { CertificatesContext } from '../contexts/certificates'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { SubnetsContext } from '../contexts/subnets'
import _Link from './Link'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import MainQuery from './MainQuery'

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
  align-items: stretch !important;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  padding-left: 0.5rem !important;
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

const { Text } = Typography

const PAGE_SIZE = 5

const SubnetInfo = () => {
  const { selectedSubnet, selectedTCEEndpoint } = useContext(
    SelectedNetworksContext
  )
  const { data: subnets } = useContext(SubnetsContext)
  const blocks = useContext(BlocksContext)
  const certificates = useContext(CertificatesContext)

  const [currentPage, setCurrentPage] = useState(1)

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
          {selectedSubnet?.endpointWs} | {selectedSubnet?.endpointHttp}
        </Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Latest block"
              loading={!Boolean(blocks[0])}
              value={blocks[0]?.number}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Latest certificate"
              loading={!Boolean(certificates && certificates.length)}
              value={
                Boolean(certificates && certificates.length)
                  ? certificates![0].position
                  : 0
              }
            />
          </Card>
        </Col>
      </Row>
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Query
      </Divider>
      <MainQuery />
      <Row gutter={32}>
        <Col md={24} lg={12}>
          <Divider orientation="left" style={{ margin: '2rem 0' }}>
            Latest Blocks -{' '}
            <Link to={`/subnet/${selectedSubnet?.id}/blocks`}>All blocks</Link>
          </Divider>
          <List
            dataSource={blocks}
            pagination={{
              position: 'bottom',
              align: 'start',
              onChange: (page) => {
                setCurrentPage(page)
              },
              pageSize: PAGE_SIZE,
              showSizeChanger: false,
            }}
            rowKey="hash"
            renderItem={(block, index) => (
              <Link to={`/subnet/${selectedSubnet?.id}/block/${block.hash}`}>
                <Item
                  actions={[
                    <Space key="list-vertical-tx">
                      <Text>{block.transactions.length.toString()}</Text>
                      <Text>tx</Text>
                    </Space>,
                    <Space key="list-vertical-date">
                      <Text>
                        {new Date(
                          (block.timestamp as number) * 1_000
                        ).toLocaleString()}
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
            Latest Certificates -{' '}
            <Link to={`/subnet/${selectedSubnet?.id}/certificates`}>
              All certificates
            </Link>
          </Divider>
          {Boolean(!selectedTCEEndpoint) ? (
            <Alert
              message="Please select a TCE endpoint first!"
              type="error"
              style={{ marginTop: 10 }}
            />
          ) : (
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
              rowKey="id"
              renderItem={(certificate, index) => (
                <Link
                  to={`/subnet/${selectedSubnet?.id}/certificate/${certificate.id}`}
                >
                  <Item
                    actions={[
                      <Space key="list-vertical-tx">
                        <Text>Target subnets:</Text>
                        {Boolean(certificate.targetSubnets.length) ? (
                          <Space>
                            {certificate.targetSubnets.map((subnetId) => (
                              <SubnetNameAndLogo
                                key={subnetId.value}
                                subnet={subnets?.find(
                                  (s) => s.id === subnetId.value
                                )}
                              />
                            ))}
                          </Space>
                        ) : (
                          <Tag>None</Tag>
                        )}
                      </Space>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text>{certificate.position}</Text>
                          {currentPage === 1 && index === 0 ? (
                            <Tag color="gold">Latest</Tag>
                          ) : null}
                        </Space>
                      }
                      description={certificate.id}
                    />
                  </Item>
                </Link>
              )}
            />
          )}
        </Col>
      </Row>
    </Space>
  )
}

export default SubnetInfo
