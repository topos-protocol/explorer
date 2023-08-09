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
import useSubnetsCertificates from '../hooks/useSubnetsCertificates'
import { SubnetsContext } from '../contexts/subnets'
import SubnetNameAndLogo from './SubnetNameAndLogo'
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

const CertificatesList = () => {
  const { certificates } = useSubnetsCertificates()
  const { data: subnets } = useContext(SubnetsContext)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  console.log(certificates)

  const handleSearch = useCallback((value: string) => {
    navigate(`/certificates/${value}`)
  }, [])

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Certificates
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Name">
          <div>Test</div>
        </Descriptions.Item>
      </Descriptions>
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
            <Item
              actions={[
                <Space key="list-vertical-tx">
                  <Text>{certificate.targetSubnets.length}</Text>
                  <Text>target subnets</Text>
                </Space>,
                <Space key="list-vertical-date">
                  <Text>Verifier</Text>
                  <Text>{certificate.verifier}</Text>
                </Space>,
              ]}
            >
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
                    <SubnetNameAndLogo
                      subnet={subnets?.find(
                        (s) => s.id === certificate.sourceSubnetId
                      )}
                    />
                    {Boolean(certificate.targetSubnets.length) && (
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
