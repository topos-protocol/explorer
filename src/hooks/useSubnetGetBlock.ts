import { BlockWithTransactions } from '@ethersproject/abstract-provider'
import { useEffect, useMemo, useState } from 'react'

import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetGetBlock(
  subnet?: Subnet,
  blockHashOrNumber?: string
) {
  const { provider } = useEthers({ subnet })
  const [block, setBlock] = useState<BlockWithTransactions>()
  const [errors, setErrors] = useState<string[]>([])

  const isBlockHashOrNumberValidHash = useMemo(
    () => blockHashOrNumber?.startsWith('0x'),
    [blockHashOrNumber]
  )
  const isBlockHashOrNumberValidNumber = useMemo(
    () => blockHashOrNumber !== undefined && !isNaN(+blockHashOrNumber),
    [blockHashOrNumber]
  )

  useEffect(
    function getBlock() {
      if (
        blockHashOrNumber &&
        (isBlockHashOrNumberValidHash || isBlockHashOrNumberValidNumber)
      ) {
        provider
          ?.getBlockWithTransactions(
            isBlockHashOrNumberValidHash
              ? blockHashOrNumber
              : parseInt(blockHashOrNumber)
          )
          .then((block) => {
            if (block) {
              setBlock(block)
            } else {
              setBlock(undefined)
              setErrors((e) => [
                ...e,
                `Could not find a block with the provided hash or number (${blockHashOrNumber})`,
              ])
            }
          })
          .catch((error) => {
            console.error(error)
            setBlock(undefined)
            setErrors((e) => [...e, error.message])
          })
      } else {
        setBlock(undefined)
      }
    },
    [provider, blockHashOrNumber]
  )

  return { block, errors }
}
