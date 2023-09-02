import * as ToposMessagingJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/interfaces/IToposMessaging.sol/IToposMessaging.json'
import { Space, Tag, Typography } from 'antd'
import { Contract } from 'ethers'
import { useContext, useEffect, useState } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import useEthers from '../hooks/useEthers'

const { Text } = Typography

enum KnownContract {
  ERC20MessagingContract = 'ERC20 Messaging Contract',
  SubnetRegistratorContract = 'Subnet Registrator Contract',
  ToposCoreContract = 'Topos Core Contract',
}

type AddressType = {
  contract: boolean
  messagingContract: boolean
  knownContract?: KnownContract
}

interface Props {
  address?: string
}

const AddressInfo = ({ address }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { provider } = useEthers({ subnet: selectedSubnet })
  const [addressType, setAddressType] = useState<AddressType>({
    contract: false,
    messagingContract: false,
  })

  useEffect(() => {
    async function processAddress() {
      switch (address) {
        case import.meta.env.VITE_ERC20_MESSAGING_CONTRACT_ADDRESS:
          setAddressType({
            contract: true,
            messagingContract: true,
            knownContract: KnownContract.ERC20MessagingContract,
          })
          break
        case import.meta.env.VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS:
          setAddressType({
            contract: true,
            messagingContract: true,
            knownContract: KnownContract.SubnetRegistratorContract,
          })
          break
        case import.meta.env.VITE_TOPOS_CORE_CONTRACT_ADDRESS:
          setAddressType({
            contract: true,
            messagingContract: true,
            knownContract: KnownContract.ToposCoreContract,
          })
          break
        default:
          if (address) {
            const code = await provider?.getCode(address)

            if (code !== '0x') {
              const contract = new Contract(address, ToposMessagingJSON.abi)
              const missingToposMessagingFunctions =
                ToposMessagingJSON.abi.filter(
                  (fragment) =>
                    fragment.type === 'function' &&
                    contract[fragment.name] === undefined
                )

              if (!missingToposMessagingFunctions.length) {
                setAddressType({ contract: true, messagingContract: true })
              } else {
                setAddressType({ contract: true, messagingContract: false })
              }
            }
          }
      }
    }

    processAddress()
  }, [provider, address])

  return (
    <Space>
      {/* {address} */}
      <span>
        {/* {addressType.contract && <Tag color="grey">Contract</Tag>}
        {addressType.messagingContract && (
          <Tag color="cyan">Messaging Contract</Tag>
        )} */}
        {addressType.knownContract ? (
          <>
            <Tag color="gold">{addressType.knownContract}</Tag>
            <Text>({address})</Text>
          </>
        ) : addressType.messagingContract ? (
          <>
            <Tag color="cyan">Messaging Contract</Tag>
            <Text>({address})</Text>
          </>
        ) : addressType.contract ? (
          <>
            <Tag color="grey">Contract</Tag>
            <Text>({address})</Text>
          </>
        ) : (
          <Text>{address}</Text>
        )}
      </span>
    </Space>
  )
}

export default AddressInfo
