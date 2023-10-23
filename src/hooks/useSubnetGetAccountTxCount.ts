import { useEffect, useState } from 'react'

import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetGetAccountTxCount(
  subnet?: Subnet,
  address?: string
) {
  const { provider } = useEthers({ subnet })
  const [txCount, setTxCount] = useState<number>()
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(
    function getBalance() {
      if (address) {
        provider
          ?.getTransactionCount(address)
          .then((txCount) => {
            setTxCount(txCount)
          })
          .catch((error) => {
            setTxCount(undefined)
            setErrors((e) => [...e, error])
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setTxCount(undefined)
      }
    },
    [provider, address]
  )

  return { errors, loading, txCount }
}
