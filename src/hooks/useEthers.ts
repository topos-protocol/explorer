import { JsonRpcProvider, WebSocketProvider } from 'ethers'
import { useContext, useMemo } from 'react'
import SturdyWebSocket from 'sturdy-websocket'

import { Subnet } from '../types'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'

interface Args {
  subnet?: Subnet
  viaMetaMask?: boolean
}

export default function useEthers({ subnet }: Args = {}) {
  const { selectedToposSubnet } = useContext(SelectedNetworksContext)
  const provider = useMemo(() => {
    const _subnet = subnet || selectedToposSubnet
    const _endpoint = _subnet?.endpointWs || _subnet?.endpointHttp

    if (_endpoint) {
      const _url = new URL(_endpoint)
      return _url.protocol.startsWith('ws')
        ? new WebSocketProvider(new SturdyWebSocket(_endpoint))
        : new JsonRpcProvider(_endpoint)
    }

    return
  }, [subnet])

  return {
    provider,
  }
}
