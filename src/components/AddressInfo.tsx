import { Space, Tag, Typography } from 'antd'
import { useContext, useEffect, useState } from 'react'

import { CONST_ADDRESS_DEPLOYER_CONTRACT_ADDRESS } from '../constants'
import { erc20MessagingContract } from '../contracts'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import useEthers from '../hooks/useEthers'
import { Token } from '../types'

const { Text } = Typography

enum KnownContract {
  ERC20MessagingContract = 'ERC20 Messaging Contract',
  SubnetRegistratorContract = 'Subnet Registrator Contract',
  ToposCoreContract = 'Topos Core Contract',
  ConstAddrDeployerContract = 'Constant Address Deployer',
}

type AddressType = {
  contract?: boolean
  erc20MessagingToken?: Token
  knownContract?: KnownContract
}

interface Props {
  address?: string
}

const AddressInfo = ({ address }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { provider } = useEthers({ subnet: selectedSubnet })
  const [addressType, setAddressType] = useState<AddressType>({})

  useEffect(() => {
    async function processAddress() {
      switch (address) {
        case import.meta.env.VITE_ERC20_MESSAGING_CONTRACT_ADDRESS:
          setAddressType({
            contract: true,
            knownContract: KnownContract.ERC20MessagingContract,
          })
          break
        case import.meta.env.VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS:
          setAddressType({
            contract: true,
            knownContract: KnownContract.SubnetRegistratorContract,
          })
          break
        case import.meta.env.VITE_TOPOS_CORE_PROXY_CONTRACT_ADDRESS:
          setAddressType({
            contract: true,
            knownContract: KnownContract.ToposCoreContract,
          })
          break
        case CONST_ADDRESS_DEPLOYER_CONTRACT_ADDRESS:
          setAddressType({
            contract: true,
            knownContract: KnownContract.ConstAddrDeployerContract,
          })
          break
        default:
          if (provider && address) {
            const code = await provider.getCode(address)
            const contract = erc20MessagingContract.connect(provider)
            const token = await contract.getTokenByAddress(address)

            if (token.symbol) {
              setAddressType({ erc20MessagingToken: token })
            } else if (code !== '0x') {
              setAddressType({ contract: true })
            }
          }
      }
    }

    processAddress()
  }, [provider, address])

  return (
    <Space>
      <span>
        {addressType.knownContract ? (
          <>
            <Tag color="gold">{addressType.knownContract}</Tag>
            <small>({address})</small>
          </>
        ) : addressType.erc20MessagingToken ? (
          <>
            <Tag>{addressType.erc20MessagingToken.symbol}</Tag>
            <Text>token </Text>
            <small>({address})</small>
          </>
        ) : addressType.contract ? (
          <>
            <Tag>Contract</Tag>
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
