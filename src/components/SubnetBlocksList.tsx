import styled from '@emotion/styled'
import { useCallback, useContext, useEffect, useState } from 'react'

import { Descriptions, Divider, Input, List, Space, Typography } from 'antd'

import { Link as _Link, useNavigate } from 'react-router-dom'
import SubnetNameAndLogo from './SubnetNameAndLogo'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { BlocksContext } from '../contexts/blocks'
import useSubnetGetBlocks from '../hooks/useSubnetGetBlocks'
import { ErrorsContext } from '../contexts/errors'

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

const BlocksList = () => {
  const { setErrors } = useContext(ErrorsContext)
  const storedBlocks = useContext(BlocksContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const [currentPage, setCurrentPage] = useState(1)
  const { blocks, errors, loading } = useSubnetGetBlocks({
    limit: PAGE_SIZE,
    skip: PAGE_SIZE * (currentPage - 1),
    subnet: selectedSubnet,
  })

  console.log(blocks)

  useEffect(
    function bubbleErrors() {
      setErrors((e) => [...e, ...errors])
    },
    [errors]
  )

  const navigate = useNavigate()

  const handleSearch = useCallback(
    (value: string) => {
      navigate(`/subnet/${selectedSubnet?.id}/block/${value}`)
    },
    [selectedSubnet]
  )

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Blocks
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Source subnet">
          <SubnetNameAndLogo subnet={selectedSubnet} />
        </Descriptions.Item>
      </Descriptions>
      <Search
        placeholder="Query block by hash or number"
        allowClear
        onSearch={handleSearch}
        style={{ width: 700 }}
      />
      <List
        dataSource={blocks}
        loading={loading}
        pagination={{
          position: 'bottom',
          align: 'start',
          onChange: (page) => {
            setCurrentPage(page)
          },
          pageSize: PAGE_SIZE,
          showSizeChanger: false,
          total: storedBlocks[0]?.number,
        }}
        rowKey="hash"
        renderItem={(block) => (
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
                  </Space>
                }
                description={block.hash}
              />
            </Item>
          </Link>
        )}
      />
    </Space>
  )
}

export default BlocksList
