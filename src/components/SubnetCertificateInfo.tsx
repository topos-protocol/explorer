import styled from '@emotion/styled'
import {
  Card,
  Col,
  Descriptions,
  Divider,
  List,
  Row,
  Space,
  Statistic,
} from 'antd'
import { useContext, useMemo } from 'react'

import { Certificate } from '../__generated__/graphql'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { SubnetsContext } from '../contexts/subnets'
import { SubnetWithId } from '../types'
import Link from './Link'
import SubnetNameAndLogo from './SubnetNameAndLogo'

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

interface Props {
  certificate?: Certificate
}

const SubnetCertificateInfo = ({ certificate }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { data: subnets } = useContext(SubnetsContext)

  const targetSubnets = useMemo(
    () =>
      certificate?.targetSubnets.reduce((acc: SubnetWithId[], targetSubnet) => {
        const subnet = subnets?.find((s) => s.id === targetSubnet)

        if (subnet) {
          acc.push(subnet)
        }

        return acc
      }, []),
    [certificate, subnets]
  )

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Info
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Source subnet" span={1}>
          <SubnetNameAndLogo subnet={selectedSubnet} />
        </Descriptions.Item>
        <Descriptions.Item label="Id" span={3}>
          {certificate?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Position" span={1}>
          {certificate?.positions.source.position || 'Unknown'}
        </Descriptions.Item>
        <Descriptions.Item label="Prev id" span={3}>
          <Link
            to={`/subnet/${selectedSubnet?.id}/certificate/${certificate?.prevId}`}
          >
            {certificate?.prevId}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Signature" span={2}>
          0x{certificate?.signature}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Data
      </Divider>
      <Descriptions>
        <Descriptions.Item label="State root" span={3}>
          0x{certificate?.stateRoot}
        </Descriptions.Item>
        <Descriptions.Item label="Receipt trie root" span={3}>
          {certificate?.receiptsRootHash}
        </Descriptions.Item>
        <Descriptions.Item label="Transaction trie root" span={3}>
          0x{certificate?.txRootHash}
        </Descriptions.Item>
      </Descriptions>
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Target subnets
      </Divider>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Number of target subnets"
              value={certificate?.targetSubnets.length}
            />
          </Card>
        </Col>
      </Row>
      <List
        dataSource={targetSubnets}
        rowKey="id"
        renderItem={(subnet) => (
          <Item>
            <List.Item.Meta title={<SubnetNameAndLogo subnet={subnet} />} />
          </Item>
        )}
      />
    </Space>
  )
}

export default SubnetCertificateInfo
