import { BlockWithTransactions } from '@ethersproject/abstract-provider'
import { useContext, useEffect, useState } from 'react'
import { ErrorsContext } from '../contexts/errors'

import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetGetBlock(
  subnet?: Subnet,
  blockHashOrNumber?: string
) {
  const { setErrors } = useContext(ErrorsContext)
  const { provider } = useEthers({ subnet })
  const [block, setBlock] = useState<BlockWithTransactions>()

  useEffect(
    function getBlock() {
      if (blockHashOrNumber) {
        provider
          ?.getBlockWithTransactions(
            blockHashOrNumber.startsWith('0x')
              ? blockHashOrNumber
              : parseInt(blockHashOrNumber)
          )
          .then((block) => {
            if (block) {
              setBlock(block)
            } else {
              setErrors((e) => [
                ...e,
                `Could not find a block with the provided hash or number (${blockHashOrNumber})`,
              ])
            }
          })
          .catch((error) => {
            console.log(error)
            setErrors((e) => [...e, error.message])
          })
      }
    },
    [provider, blockHashOrNumber]
  )

  return { block }
}
