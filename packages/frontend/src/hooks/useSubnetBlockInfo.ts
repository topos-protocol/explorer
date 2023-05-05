import { ethers } from 'ethers'
import React, { useCallback, useEffect } from 'react'
import { ErrorsContext } from '../contexts/errors'

import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetBlockInfo(subnet?: Subnet) {
  const { setErrors } = React.useContext(ErrorsContext)
  const { provider } = useEthers({ subnet })
  const [blocks, setBlocks] = React.useState<ethers.providers.Block[]>([])

  const appendBlock = useCallback(
    (blockNumber: number) => {
      provider?.getBlock(blockNumber).then((block) => {
        setBlocks((b) => [block, ...b])
      })
    },
    [provider]
  )

  useEffect(
    function subscribeToBlock() {
      const listener = (blockNumber: number) => {
        appendBlock(blockNumber)
      }

      provider?.on('block', listener)

      return function cleanup() {
        provider?.removeListener('block', listener)
      }
    },
    [provider]
  )

  return { blocks }
}
