import { Block } from 'ethers'
import { useCallback, useContext, useEffect, useState } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetSubscribeToBlocks(subnet?: Subnet) {
  const { setErrors } = useContext(ErrorsContext)
  const { provider } = useEthers({ subnet })
  const [blocks, setBlocks] = useState<Block[]>([])

  const appendBlock = useCallback(
    (blockNumber: number) => {
      provider?.getBlock(blockNumber).then((block) => {
        if (block) {
          setBlocks((b) => [block, ...b])
        }
      })
    },
    [provider]
  )

  useEffect(
    function subscribeToBlock() {
      setBlocks([])

      const listener = (blockNumber: number) => {
        appendBlock(blockNumber)
      }

      try {
        provider?.on('block', listener)
      } catch (error: any) {
        setErrors((e) => [...e, error])
      }

      return function cleanup() {
        provider?.removeListener('block', listener)
      }
    },
    [provider]
  )

  return { blocks }
}
