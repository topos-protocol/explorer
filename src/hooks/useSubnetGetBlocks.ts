import { Block } from '@ethersproject/abstract-provider'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Subnet } from '../types'
import useEthers from './useEthers'

const DEFAULT_LIMIT = 10
const DEFAULT_SKIP = 0

interface Options {
  limit?: number
  skip?: number
  subnet?: Subnet
}

export default function useSubnetGetBlocks({ limit, skip, subnet }: Options) {
  const definedLimit = useMemo(() => limit || DEFAULT_LIMIT, [limit])
  const definedSkip = useMemo(() => skip || DEFAULT_SKIP, [skip])
  const { provider } = useEthers({ subnet })
  const [blocks, setBlocks] = useState<Block[]>()
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>()

  const getBlock = useCallback(
    (_number: number) => {
      return provider?.getBlock(_number)
    },
    [provider]
  )

  useEffect(
    function getBlocks() {
      setLoading(true)
      const promises: Array<Promise<Block> | undefined> = []

      for (let i = definedSkip; i < definedSkip + definedLimit; i++) {
        promises.push(getBlock(i))
      }

      Promise.all(promises)
        .then((blocks) => {
          setBlocks(blocks.filter((b): b is Block => b != undefined))
        })
        .catch((error) => {
          setErrors((e) => [...e, error])
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [provider, definedLimit, definedSkip]
  )

  return { blocks, errors, loading }
}
