import { TransactionReceipt, TransactionResponse } from 'ethers'
import { useEffect, useState } from 'react'

import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetGetTransactionAndReceipt(
  subnet?: Subnet,
  transactionHash?: string
) {
  const { provider } = useEthers({ subnet })
  const [transaction, setTransaction] = useState<TransactionResponse | null>()
  const [receipt, setReceipt] = useState<TransactionReceipt | null>()
  const [errors, setErrors] = useState<string[]>([])

  useEffect(
    function getBlock() {
      if (transactionHash) {
        provider
          ?.getTransaction(transactionHash)
          .then((transaction) => {
            setTransaction(transaction)
          })
          .catch((error) => {
            setTransaction(undefined)
            setErrors((e) => [...e, error])
          })

        provider
          ?.getTransactionReceipt(transactionHash)
          .then((receipt) => {
            setReceipt(receipt)
          })
          .catch((error) => {
            setReceipt(undefined)
            setErrors((e) => [...e, error])
          })
      } else {
        setTransaction(undefined)
        setReceipt(undefined)
      }
    },
    [provider, transactionHash]
  )

  return { errors, receipt, transaction }
}
