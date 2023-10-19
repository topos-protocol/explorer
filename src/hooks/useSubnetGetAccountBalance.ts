import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'

import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetGetAccountBalance(
  subnet?: Subnet,
  address?: string
) {
  const { provider } = useEthers({ subnet })
  const [balance, setBalance] = useState<BigNumber>()
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(
    function getBalance() {
      if (address) {
        provider
          ?.getBalance(address)
          .then((balance) => {
            setBalance(balance)
          })
          .catch((error) => {
            setBalance(undefined)
            setErrors((e) => [...e, error])
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setBalance(undefined)
      }
    },
    [provider, address]
  )

  return { balance, errors, loading }
}
