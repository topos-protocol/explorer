import React, { useEffect } from 'react'
import { ErrorsContext } from '../contexts/errors'

import { Subnet } from '../types'
import useEthers from './useEthers'
import {
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/abstract-provider'

export default function useSubnetGetTransactionAndReceipt(
  subnet?: Subnet,
  transactionHash?: string
) {
  const { setErrors } = React.useContext(ErrorsContext)
  const { provider } = useEthers({ subnet })
  const [transaction, setTransaction] = React.useState<TransactionResponse>()
  const [receipt, setReceipt] = React.useState<TransactionReceipt>()

  useEffect(
    function getBlock() {
      if (transactionHash) {
        provider?.getTransaction(transactionHash).then((transaction) => {
          setTransaction(transaction)
        })

        provider?.getTransactionReceipt(transactionHash).then((receipt) => {
          setReceipt(receipt)
        })
      }
    },
    [provider, transactionHash]
  )

  return { receipt, transaction }
}
