import React, { useContext, useMemo } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  List,
  Pagination,
  Row,
  Space,
  Statistic,
  Table,
} from 'antd'
import useSubnetBlockInfo from '../hooks/useSubnetBlockInfo'
import useSubnetCertInfo from '../hooks/useSubnetCertInfo'
import { ethers } from 'ethers'
import { shortenAddress } from '../utils'
import { Link } from 'react-router-dom'

const PAGE_SIZE = 10

const SubnetInfo = () => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { blocks } = useSubnetBlockInfo(selectedSubnet)
  const { latestCertificate } = useSubnetCertInfo(selectedSubnet)

  const viewBlocks = useMemo(() => {
    let viewBlocks
    if (blocks.length % PAGE_SIZE !== 0) {
      viewBlocks = [
        ...blocks,
        ...Array.apply(
          null,
          Array(PAGE_SIZE - (blocks.length % PAGE_SIZE))
        ).map((_, index) => ({ key: index, hash: '' })),
      ]
    } else {
      viewBlocks = blocks
    }

    return viewBlocks
  }, [blocks])

  return (
    <Space direction="vertical">
      <Divider orientation="left">Info</Divider>
      <Descriptions>
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
      <Divider orientation="left">Latest Blocks</Divider>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 6 }}
        dataSource={viewBlocks}
        pagination={{ position: 'bottom', align: 'start', pageSize: PAGE_SIZE }}
        renderItem={(
          block: ethers.providers.Block | { key: number; hash: string }
        ) =>
          block.hash ? (
            <List.Item>
              <Card
                size="small"
                title={(block as ethers.providers.Block).number}
                type="inner"
              >
                <p>{shortenAddress(block.hash)}</p>
                <p>
                  {new Date(
                    (block as ethers.providers.Block).timestamp * 1_000
                  ).toLocaleString()}
                </p>
                <p>{`${
                  (block as ethers.providers.Block).transactions.length
                } tx`}</p>
              </Card>
            </List.Item>
          ) : (
            <List.Item>
              <Card
                size="small"
                title=" "
                type="inner"
                style={{ opacity: 0.5 }}
              >
                <p style={{ visibility: 'hidden' }}>bla</p>
                <p style={{ visibility: 'hidden' }}>bla</p>
                <p style={{ visibility: 'hidden' }}>bla</p>
              </Card>
            </List.Item>
          )
        }
      />
    </Space>
  )
}

export default SubnetInfo
