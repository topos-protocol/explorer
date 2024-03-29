import * as ERC20MessagingJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/examples/ERC20Messaging.sol/ERC20Messaging.json'
import * as BurnableMintableCappedERC20JSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/BurnableMintableCappedERC20.sol/BurnableMintableCappedERC20.json'
import * as SubnetRegistratorJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/SubnetRegistrator.sol/SubnetRegistrator.json'
import * as TokenDeployerJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/TokenDeployer.sol/TokenDeployer.json'
import * as ToposCoreJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ToposCore.sol/ToposCore.json'
import styled from '@emotion/styled'
import { Descriptions, List, Space, Tag, Typography } from 'antd'
import {
  formatUnits,
  Interface,
  Log,
  LogDescription,
  TransactionReceipt,
} from 'ethers'
import { useContext, useEffect, useState } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import useEthers from '../hooks/useEthers'
import DescriptionsItem from 'antd/es/descriptions/Item'
import AddressInfo from './AddressInfo'

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

const PAGE_SIZE = 10

const { Text } = Typography

interface LogOrDescription {
  address: string
  data: Log | LogDescription | null
  index: number
  type: 'log' | 'description'
}

interface Props {
  receipt?: TransactionReceipt | null
}

const SubnetTransactionReceiptLogs = ({ receipt }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { provider } = useEthers({ subnet: selectedSubnet })
  const [logOrDescriptions, setLogOrDescriptions] = useState<
    LogOrDescription[]
  >([])

  useEffect(
    function processReceipt() {
      const logOrDescriptions: LogOrDescription[] = []

      receipt?.logs.forEach((log) => {
        let iface: Interface | undefined

        switch (log.address) {
          case import.meta.env.VITE_ERC20_MESSAGING_CONTRACT_ADDRESS:
            iface = new Interface(ERC20MessagingJSON.abi)
            break
          case import.meta.env.VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS:
            iface = new Interface(SubnetRegistratorJSON.abi)
            break
          case import.meta.env.VITE_TOPOS_CORE_PROXY_CONTRACT_ADDRESS:
            iface = new Interface(ToposCoreJSON.abi)
            break
          case import.meta.env.VITE_TOKEN_DEPLOYER_CONTRACT_ADDRESS:
            iface = new Interface(TokenDeployerJSON.abi)
            break
          case import.meta.env.VITE_TOPOS_CORE_PROXY_CONTRACT_ADDRESS:
            iface = new Interface(ToposCoreJSON.abi)
            break
          default:
            iface = new Interface(BurnableMintableCappedERC20JSON.abi)
        }

        if (iface) {
          try {
            logOrDescriptions.push({
              address: log.address,
              data: iface.parseLog({
                topics: log.topics as string[],
                data: log.data,
              }),
              index: log.index,
              type: 'description',
            })
          } catch (error) {
            console.log(error)
            logOrDescriptions.push({
              address: log.address,
              data: log,
              index: log.index,
              type: 'log',
            })
          }
        } else {
          logOrDescriptions.push({
            address: log.address,
            data: log,
            index: log.index,
            type: 'log',
          })
        }
      })

      setLogOrDescriptions(logOrDescriptions)
    },
    [provider, receipt]
  )

  return (
    <List
      dataSource={logOrDescriptions}
      pagination={{
        position: 'bottom',
        align: 'start',
        pageSize: PAGE_SIZE,
      }}
      rowKey="index"
      renderItem={(logOrDescription) => (
        <Item>
          <List.Item.Meta
            title={
              <Space>
                <Text>#{logOrDescription.index}</Text>
              </Space>
            }
            description={
              <Space>
                {logOrDescription.type === 'description' &&
                  logOrDescription.data && (
                    <Descriptions size="small">
                      <DescriptionsItem label="Origin" span={3}>
                        <AddressInfo address={logOrDescription.address} />
                      </DescriptionsItem>
                      <DescriptionsItem label="Name" span={3}>
                        <Tag color="pink">
                          {(logOrDescription.data as LogDescription).name}
                        </Tag>
                      </DescriptionsItem>
                      <DescriptionsItem span={3}>
                        <Text>Args</Text>
                      </DescriptionsItem>
                      {(
                        logOrDescription.data as LogDescription
                      ).fragment.inputs.map((input) => (
                        <DescriptionsItem
                          key={input.name}
                          label={input.name}
                          span={3}
                        >
                          {typeof (logOrDescription.data as LogDescription)
                            .args[input.name] === 'object'
                            ? JSON.stringify(
                                (logOrDescription.data as LogDescription).args[
                                  input.name
                                ]
                              )
                            : typeof (logOrDescription.data as LogDescription)
                                .args[input.name] == 'bigint'
                            ? formatUnits(
                                (logOrDescription.data as LogDescription).args[
                                  input.name
                                ]
                              )
                            : (logOrDescription.data as LogDescription).args[
                                input.name
                              ]}
                        </DescriptionsItem>
                      ))}
                    </Descriptions>
                  )}
                {logOrDescription.type === 'log' && (
                  <Descriptions size="small">
                    <DescriptionsItem span={3}>
                      <i>raw log</i>
                    </DescriptionsItem>
                    <DescriptionsItem label="Origin" span={3}>
                      <AddressInfo address={logOrDescription.address} />
                    </DescriptionsItem>
                    <DescriptionsItem label="Data" span={3}>
                      {(logOrDescription.data as Log).data}
                    </DescriptionsItem>
                    <DescriptionsItem span={3}>
                      <Text>Topics</Text>
                    </DescriptionsItem>
                    {(logOrDescription.data as Log).topics.map(
                      (topic, index) => (
                        <DescriptionsItem
                          key={index}
                          label={`#${index}`}
                          span={3}
                        >
                          <Text>{topic}</Text>
                        </DescriptionsItem>
                      )
                    )}
                  </Descriptions>
                )}
              </Space>
            }
          />
        </Item>
      )}
    />
  )
}

export default SubnetTransactionReceiptLogs
