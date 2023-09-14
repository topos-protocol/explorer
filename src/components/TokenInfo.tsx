import { Tag } from 'antd'
import { useContext, useEffect, useState } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import useEthers from '../hooks/useEthers'
import { erc20MessagingContract } from '../contracts'
import { Token } from '../types'

interface Props {
  address?: string
}

const TokenInfo = ({ address }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { provider } = useEthers({ subnet: selectedSubnet })
  const [token, setToken] = useState<Token>()

  useEffect(() => {
    async function processToken() {
      if (provider && address) {
        const contract = erc20MessagingContract.connect(provider)

        const token = await contract.getTokenByAddress(address)
        setToken(token.symbol ? token : { addr: 'unknown', symbol: '???' })
      }
    }

    processToken()
  }, [provider, address])

  return (
    <>
      <Tag>{token?.symbol}</Tag>
      <small>({token?.addr})</small>
    </>
  )
}

export default TokenInfo
