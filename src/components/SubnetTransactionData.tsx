import * as ERC20MessagingJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/examples/ERC20Messaging.sol/ERC20Messaging.json'
import * as ConstAddressDeployerJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ConstAddressDeployer.sol/ConstAddressDeployer.json'
import * as ToposCoreJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ToposCore.sol/ToposCore.json'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { TransactionDescription } from 'ethers/lib/utils'
import { Collapse, Descriptions, Tag, Typography } from 'antd'
import { ethers } from 'ethers'
import { ReactNode, useContext, useEffect, useState } from 'react'

import SubnetNameAndLogo from './SubnetNameAndLogo'
import TokenInfo from './TokenInfo'
import Link from '../components/Link'
import { CONST_ADDRESS_DEPLOYER_CONTRACT_ADDRESS } from '../constants'
import { SubnetsContext } from '../contexts/subnets'

type RenderedTransactionDescription = TransactionDescription & {
  output?: ReactNode
}

const { Text } = Typography

interface Props {
  transaction?: TransactionResponse
}

const SubnetTransactionData = ({ transaction }: Props) => {
  const { data: subnets } = useContext(SubnetsContext)
  const [description, setDescription] =
    useState<RenderedTransactionDescription>()

  useEffect(
    function parseTransaction() {
      let iface: ethers.utils.Interface | undefined

      switch (transaction?.to) {
        case import.meta.env.VITE_ERC20_MESSAGING_CONTRACT_ADDRESS:
          iface = new ethers.utils.Interface(ERC20MessagingJSON.abi)

          try {
            if (iface && transaction) {
              const description: RenderedTransactionDescription =
                iface.parseTransaction({
                  data: transaction.data,
                })

              switch (description.name) {
                case 'sendToken':
                  console.log(description.args.targetSubnetId)
                  description.output = (
                    <Descriptions>
                      <Descriptions.Item label="Method" span={3}>
                        <Tag color="pink">{description?.name}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Token">
                        <TokenInfo address={description?.args.tokenAddress} />
                      </Descriptions.Item>
                      <Descriptions.Item label="Amount">
                        {ethers.utils.formatUnits(description?.args.amount)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Receiving subnet">
                        <SubnetNameAndLogo
                          subnet={subnets?.find(
                            (s) => s.id === description?.args.targetSubnetId
                          )}
                        />
                      </Descriptions.Item>
                    </Descriptions>
                  )
                  break
                case 'deployToken':
                  const [name, symbol, cap, , dailyMintLimit, initialSupply] =
                    ethers.utils.defaultAbiCoder.decode(
                      [
                        'string',
                        'string',
                        'uint256',
                        'address',
                        'uint256',
                        'uint256',
                      ],
                      description?.args.params
                    )
                  description.output = (
                    <Descriptions>
                      <Descriptions.Item label="Method" span={3}>
                        <Tag color="pink">{description?.name}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Token">
                        <Tag>{symbol}</Tag>
                        <small>({name})</small>
                      </Descriptions.Item>
                      {Boolean(cap) && (
                        <Descriptions.Item label="Cap">
                          {ethers.utils.formatUnits(cap)}
                        </Descriptions.Item>
                      )}
                      {Boolean(dailyMintLimit) && (
                        <Descriptions.Item label="Daily mint limit">
                          {ethers.utils.formatUnits(dailyMintLimit)}
                        </Descriptions.Item>
                      )}
                      {Boolean(initialSupply) && (
                        <Descriptions.Item label="Initial supply">
                          {ethers.utils.formatUnits(initialSupply)}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  )
                  break
              }

              setDescription(description)
            }
          } catch (error) {}
          break
        case import.meta.env.VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS:
          break
        case import.meta.env.VITE_TOPOS_CORE_PROXY_CONTRACT_ADDRESS:
          iface = new ethers.utils.Interface(ToposCoreJSON.abi)

          try {
            if (iface && transaction) {
              const description: RenderedTransactionDescription =
                iface.parseTransaction({
                  data: transaction.data,
                })

              // console.log(description)
              switch (description.name) {
                case 'deploy':
                  description.output = (
                    <Descriptions>
                      <Descriptions.Item label="Method" span={3}>
                        <Tag color="pink">{description?.name}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  )
                  break
                case 'pushCertificate':
                  const [, sourceSubnetId, , , , , , certificateId, , ,] =
                    ethers.utils.defaultAbiCoder.decode(
                      [
                        'bytes32',
                        'bytes32',
                        'bytes32',
                        'bytes32',
                        'bytes32',
                        'bytes32[]',
                        'uint32',
                        'bytes32',
                        'bytes',
                        'bytes',
                      ],
                      description?.args.certBytes
                    )

                  const sourceSubnet = subnets?.find(
                    (s) => s.id === sourceSubnetId
                  )

                  description.output = (
                    <Descriptions>
                      <Descriptions.Item label="Method" span={3}>
                        <Tag color="pink">{description?.name}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Certificate source subnet">
                        <SubnetNameAndLogo subnet={sourceSubnet} />
                      </Descriptions.Item>
                      <Descriptions.Item label="Certificate id" span={2}>
                        <Link
                          to={`/subnet/${sourceSubnet?.id}/certificate/${certificateId}`}
                        >
                          {certificateId}
                        </Link>
                      </Descriptions.Item>
                      <Descriptions.Item label="Certificate position">
                        <Link
                          to={`/subnet/${
                            sourceSubnet?.id
                          }/certificate/${description.args.position.toString()}`}
                        >
                          {description.args.position.toString()}
                        </Link>
                      </Descriptions.Item>
                    </Descriptions>
                  )
                  break
                case 'setNetworkSubnetId':
                  break
                default:
              }

              setDescription(description)
            }
          } catch (error) {}
          break
        case CONST_ADDRESS_DEPLOYER_CONTRACT_ADDRESS:
          iface = new ethers.utils.Interface(ConstAddressDeployerJSON.abi)

          try {
            if (iface && transaction) {
              const description: RenderedTransactionDescription =
                iface.parseTransaction({
                  data: transaction.data,
                })

              switch (description.name) {
                case 'deploy':
                  description.output = (
                    <Descriptions>
                      <Descriptions.Item label="Method" span={3}>
                        <Tag color="pink">{description?.name}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  )
                  break
                default:
              }

              setDescription(description)
            }
          } catch (error) {}
          break
        default:
      }
    },
    [transaction]
  )

  return (
    <>
      {description?.output}
      <Collapse
        items={[
          {
            key: 1,
            label: 'Raw Data',
            children: <Text>{transaction?.data}</Text>,
          },
        ]}
      />
    </>
  )
}

export default SubnetTransactionData
