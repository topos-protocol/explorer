import { SubnetRegistrator__factory } from '@topos-protocol/topos-smart-contracts/typechain-types/factories/contracts/topos-core'
import { ethers } from 'ethers'
import { useContext, useEffect, useMemo, useState } from 'react'
import { ErrorsContext } from '../contexts/errors'

import { Subnet, SubnetWithId } from '../types'
import useEthers from './useEthers'

export default function useRegisteredSubnets(toposSubnet?: SubnetWithId) {
  const { setErrors } = useContext(ErrorsContext)
  const { provider } = useEthers({ subnet: toposSubnet })
  const [loading, setLoading] = useState(false)
  const [registeredSubnets, setRegisteredSubnets] = useState<SubnetWithId[]>()

  const contract = useMemo(
    () =>
      provider
        ? SubnetRegistrator__factory.connect(
            import.meta.env.VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS,
            provider
          )
        : undefined,
    [provider]
  )

  useEffect(
    function init() {
      async function getRegisteredSubnets() {
        setLoading(true)

        const registeredSubnetsCount = await contract
          ?.getSubnetCount()
          .then((count: ethers.BigNumber) => count.toNumber())
          .catch((error: any) => {
            console.error(error)
            setErrors((e) => [
              ...e,
              `Error when fetching the count of registered subnets.`,
            ])
          })

        if (registeredSubnetsCount !== undefined) {
          const promises = []
          let i = 0
          while (i < registeredSubnetsCount) {
            const subnetId = await contract
              ?.getSubnetIdAtIndex(i)
              .catch((error: any) => {
                console.error(error)
                setErrors((e) => [
                  ...e,
                  `Error fetching the id of the registered subnet at index ${i}.`,
                ])
              })

            if (subnetId !== undefined) {
              promises.push(
                contract
                  ?.subnets(subnetId)
                  .then((subnet: Subnet) => ({
                    ...subnet,
                    id: subnetId,
                  }))
                  .catch((error: Error) => {
                    console.error(error)
                    setErrors((e) => [
                      ...e,
                      `Error fetching registered subnet with id ${subnetId}.`,
                    ])
                  })
              )
            }
            i++
          }

          const subnets = await Promise.allSettled(promises).then((values) =>
            values
              .filter((v) => v.status === 'fulfilled')
              .map((v) => (v as PromiseFulfilledResult<SubnetWithId>).value)
          )
          setRegisteredSubnets(subnets)
        }

        setLoading(false)
      }

      getRegisteredSubnets()
    },
    [contract]
  )

  return { loading, registeredSubnets }
}
