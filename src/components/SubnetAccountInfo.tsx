import {
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
} from 'antd'
import { utils } from 'ethers'
import { useContext, useEffect } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import useSubnetGetAccountBalance from '../hooks/useSubnetGetAccountBalance'
import useSubnetGetAccountTxCount from '../hooks/useSubnetGetAccountTxCount'
import useSubnetGetAccountCode from '../hooks/useSubnetGetAccountCode'

interface Props {
  address: string
}

const SubnetAccountInfo = ({ address }: Props) => {
  const { setErrors } = useContext(ErrorsContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const {
    balance,
    errors: getBalanceErrors,
    loading: getBalanceLoading,
  } = useSubnetGetAccountBalance(selectedSubnet, address)
  const {
    txCount,
    errors: getTxCountErrors,
    loading: getTxCountLoading,
  } = useSubnetGetAccountTxCount(selectedSubnet, address)
  const {
    code,
    errors: getCodeErrors,
    loading: getCodeLoading,
  } = useSubnetGetAccountCode(selectedSubnet, address)

  useEffect(
    function bubbleErrors() {
      setErrors((e) => [
        ...e,
        ...getBalanceErrors,
        ...getTxCountErrors,
        ...getCodeErrors,
      ])
    },
    [getBalanceErrors, getTxCountErrors, getCodeErrors]
  )

  return (
    <Space direction="vertical">
      <Divider orientation="left" style={{ margin: '2rem 0' }}>
        Account Info
      </Divider>
      <Descriptions>
        <Descriptions.Item label="Type">
          {getCodeLoading ? (
            <Spin />
          ) : code === '0x' ? (
            <Tag color="cyan">EOA</Tag>
          ) : (
            <Tag color="gold">Contract</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions>
        <Descriptions.Item label="Address">{address}</Descriptions.Item>
      </Descriptions>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Balance"
              loading={getBalanceLoading}
              suffix={selectedSubnet?.currencySymbol}
              value={balance !== undefined ? utils.formatUnits(balance) : ''}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Transaction count"
              loading={getTxCountLoading}
              value={txCount}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  )
}

export default SubnetAccountInfo
