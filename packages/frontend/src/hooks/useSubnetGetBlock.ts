import { BlockWithTransactions } from '@ethersproject/abstract-provider'
import React, { useEffect } from 'react'
import { ErrorsContext } from '../contexts/errors'

import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetGetBlock(
  subnet?: Subnet,
  blockHashOrNumber?: string
) {
  const { setErrors } = React.useContext(ErrorsContext)
  const { provider } = useEthers({ subnet })
  const [block, setBlock] = React.useState<BlockWithTransactions>()

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
            setBlock(block)
          })
      }
    },
    [provider, blockHashOrNumber]
  )

  return { block }
}
