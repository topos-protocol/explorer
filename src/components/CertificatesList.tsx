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
import useSubnetCertInfo from '../hooks/useSubnetCertInfo'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import { Link as _Link, useNavigate } from 'react-router-dom'
import useSubnetsCertificates from '../hooks/useSubnetsCertificates'

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

const CertificatesList = () => {
  const { certificates } = useSubnetsCertificates()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const handleSearch = useCallback((value: string) => {
    navigate(`/certificates/${value}`)
  }, [])

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Certificates
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
        rowKey="stateRoot"
        renderItem={(certificate, index) => (
          <Link to={`/certificates/${certificate.stateRoot}`}>
            <Item
              actions={[
                <Space key="list-vertical-tx">
                  <Text>{certificate.}</Text>
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
                    <Text>{certificate.stateRoot}</Text>
                    {currentPage === 1 && index === 0 ? (
                      <Tag color="gold">Latest</Tag>
                    ) : null}
                  </Space>
                }
                description={
                  <Space>
                    <Text>{certificate.sourceSubnetId}</Text>
                    {Boolean(certificate.targetSubnets.length) && (
                    <>
                      <CaretRightOutlined />
                      <Text>{certificate.targetSubnets[0].value}</Text>
                    </>
                    )}
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

export default CertificatesList
