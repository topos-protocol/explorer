import * as ERC20MessagingJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/examples/ERC20Messaging.sol/ERC20Messaging.json'
import * as ConstAddressDeployerJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ConstAddressDeployer.sol/ConstAddressDeployer.json'
import * as ToposCoreJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ToposCore.sol/ToposCore.json'
import { Collapse, Descriptions, Tag, Typography } from 'antd'
import {
  AbiCoder,
  formatUnits,
  Interface,
  TransactionDescription,
  TransactionResponse,
} from 'ethers'
import { ReactNode, useContext, useEffect, useState } from 'react'

import SubnetNameAndLogo from './SubnetNameAndLogo'
import TokenInfo from './TokenInfo'
import Link from '../components/Link'
import { CONST_ADDRESS_DEPLOYER_CONTRACT_ADDRESS } from '../constants'
import { SubnetsContext } from '../contexts/subnets'

type RenderedTransactionDescription =
  | (TransactionDescription & {
      output?: ReactNode
    })
  | null

const defaultAbiCoder = AbiCoder.defaultAbiCoder()

const { Text } = Typography

interface Props {
  transaction?: TransactionResponse | null
}

const SubnetTransactionData = ({ transaction }: Props) => {
  const { data: subnets } = useContext(SubnetsContext)
  const [description, setDescription] =
    useState<RenderedTransactionDescription>()

  useEffect(
    function parseTransaction() {
      let iface: Interface | undefined

      switch (transaction?.to) {
        case import.meta.env.VITE_ERC20_MESSAGING_CONTRACT_ADDRESS:
          iface = new Interface(ERC20MessagingJSON.abi)

          try {
            if (iface && transaction) {
              const description: RenderedTransactionDescription =
                iface.parseTransaction({
                  data: transaction.data,
                })

              if (description) {
                switch (description.name) {
                  case 'execute':
                    description.output = (
                      <Descriptions>
                        <Descriptions.Item label="Method" span={3}>
                          <Tag color="pink">{description?.name}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Log indexes">
                          {description?.args.logIndexes.map(
                            (logIndex: bigint, index: number) => (
                              <span key={index}>
                                {`${
                                  index !== 0 ? ' | ' : ''
                                }${logIndex.toString()}`}
                              </span>
                            )
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Receipt root" span={2}>
                          {description.args.receiptRoot}
                        </Descriptions.Item>
                        <Descriptions.Item label="Proof blob" span={3}>
                          {description?.args.proofBlob}
                        </Descriptions.Item>
                      </Descriptions>
                    )
                    break
                  case 'sendToken':
                    description.output = (
                      <Descriptions>
                        <Descriptions.Item label="Method" span={3}>
                          <Tag color="pink">{description?.name}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Token">
                          <TokenInfo symbol={description?.args.symbol} />
                        </Descriptions.Item>
                        <Descriptions.Item label="Amount">
                          {formatUnits(description?.args.amount)}
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
                    const [name, symbol, cap, dailyMintLimit, initialSupply] =
                      defaultAbiCoder.decode(
                        ['string', 'string', 'uint256', 'uint256', 'uint256'],
                        description?.args.params
                      )
                    console.log(cap, initialSupply)
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
                            {formatUnits(cap)}
                          </Descriptions.Item>
                        )}
                        {Boolean(dailyMintLimit) && (
                          <Descriptions.Item label="Daily mint limit">
                            {formatUnits(dailyMintLimit)}
                          </Descriptions.Item>
                        )}
                        {Boolean(initialSupply) && (
                          <Descriptions.Item label="Initial supply">
                            {formatUnits(initialSupply)}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    )
                    break
                }
              }

              setDescription(description)
            }
          } catch (error) {}
          break
        case import.meta.env.VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS:
          break
        case import.meta.env.VITE_TOPOS_CORE_PROXY_CONTRACT_ADDRESS:
          iface = new Interface(ToposCoreJSON.abi)

          try {
            if (iface && transaction) {
              const description: RenderedTransactionDescription =
                iface.parseTransaction({
                  data: transaction.data,
                })

              if (description) {
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
                      defaultAbiCoder.decode(
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
              }

              setDescription(description)
            }
          } catch (error) {}
          break
        case CONST_ADDRESS_DEPLOYER_CONTRACT_ADDRESS:
          iface = new Interface(ConstAddressDeployerJSON.abi)

          try {
            if (iface && transaction) {
              const description: RenderedTransactionDescription =
                iface.parseTransaction({
                  data: transaction.data,
                })

              if (description) {
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
