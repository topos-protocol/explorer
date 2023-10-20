import styled from '@emotion/styled'
import { useCallback, useContext, useState } from 'react'

import {
  Descriptions,
  Divider,
  Input,
  List,
  Space,
  Tag,
  Typography,
} from 'antd'

import { Link as _Link, useNavigate } from 'react-router-dom'
import useSubnetGetCertificates from '../hooks/useSubnetGetCertificates'
import { SubnetsContext } from '../contexts/subnets'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import { CaretRightOutlined } from '@ant-design/icons'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { BlocksContext } from '../contexts/blocks'

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

const PAGE_SIZE = 8

const CertificatesList = () => {
  const { data: subnets } = useContext(SubnetsContext)
  const blocks = useContext(BlocksContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const [currentPage, setCurrentPage] = useState(1)
  const { certificates, loading } = useSubnetGetCertificates({
    limit: PAGE_SIZE,
    skip: PAGE_SIZE * (currentPage - 1),
    sourceStreamPosition: {
      sourceSubnetId: { value: selectedSubnet?.id || '' },
    },
  })

  const navigate = useNavigate()

  const handleSearch = useCallback(
    (value: string) => {
      navigate(`/subnet/${selectedSubnet?.id}/certificate/${value}`)
    },
    [selectedSubnet]
  )

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Certificates
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Source subnet">
          <SubnetNameAndLogo subnet={selectedSubnet} />
        </Descriptions.Item>
      </Descriptions>
      <Search
        placeholder="Query certificate by id or position"
        allowClear
        onSearch={handleSearch}
        style={{ width: 700 }}
      />
      <List
        dataSource={certificates}
        loading={loading}
        pagination={{
          position: 'bottom',
          align: 'start',
          onChange: (page) => {
            setCurrentPage(page)
          },
          pageSize: PAGE_SIZE,
          showSizeChanger: false,
          total: blocks[0]?.number,
        }}
        rowKey="id"
        renderItem={(certificate) => (
          <Link
            to={`/subnet/${selectedSubnet?.id}/certificate/${certificate.id}`}
          >
            <Item
              actions={[
                <Space key="list-vertical-tx">
                  <Text>Target subnets:</Text>
                  {Boolean(certificate.targetSubnets.length) ? (
                    <Space>
                      <CaretRightOutlined />
                      {certificate.targetSubnets.map((subnetId) => (
                        <SubnetNameAndLogo
                          key={subnetId.value}
                          subnet={subnets?.find((s) => s.id === subnetId.value)}
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
                  </Space>
                }
                description={certificate.id}
              />
            </Item>
          </Link>
        )}
      />
    </Space>
  )
}

export default CertificatesList
