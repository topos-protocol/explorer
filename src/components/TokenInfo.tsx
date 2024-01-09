import { ERC20Messaging__factory } from '@topos-protocol/topos-smart-contracts/typechain-types'
import { Tag } from 'antd'
import { useContext, useEffect, useState } from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import useEthers from '../hooks/useEthers'
import { Token } from '../types'

interface Props {
  symbol?: string
}

const TokenInfo = ({ symbol }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { provider } = useEthers({ subnet: selectedSubnet })
  const [token, setToken] = useState<Token>()

  useEffect(() => {
    async function processToken() {
      if (provider && symbol) {
        const ERC20Messaging = ERC20Messaging__factory.connect(
          import.meta.env.VITE_ERC20_MESSAGING_CONTRACT_ADDRESS,
          provider
        )
        const token = await ERC20Messaging.getTokenBySymbol(symbol)
        setToken(token.symbol ? token : { addr: 'unknown', symbol: '???' })
      }
    }

    processToken()
  }, [provider, symbol])

  return (
    <>
      <Tag>{token?.symbol}</Tag>
      <small>({token?.addr})</small>
    </>
  )
}

export default TokenInfo
