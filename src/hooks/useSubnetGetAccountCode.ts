import { useEffect, useState } from 'react'

import { Subnet } from '../types'
import useEthers from './useEthers'

export default function useSubnetGetAccountCode(
  subnet?: Subnet,
  address?: string
) {
  const { provider } = useEthers({ subnet })
  const [code, setCode] = useState<string>()
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(
    function getBalance() {
      if (address) {
        provider
          ?.getCode(address)
          .then((code) => {
            setCode(code)
          })
          .catch((error) => {
            setCode(undefined)
            setErrors((e) => [...e, error])
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setCode(undefined)
      }
    },
    [provider, address]
  )

  return { code, errors, loading }
}
