import { useSubscription } from '@apollo/client'
import { useEffect, useState } from 'react'

import { graphql } from '../__generated__/gql'
import { Certificate } from '../types'
import { SubnetFilter } from '../__generated__/graphql'

const WATCH_CERTIFICATES = graphql(`
  subscription OnCertificates($filter: SubnetFilter) {
    watchDeliveredCertificates(filter: $filter) {
      prevId
      id
      proof
      signature
      sourceSubnetId {
        value
      }
      stateRoot
      targetSubnets {
        value
      }
      receiptsRootHash
      txRootHash
      verifier
    }
  }
`)

interface Options {
  filter?: SubnetFilter
}

export default function useSubnetSubscribeToCertificates({ filter }: Options) {
  const [certificates, setCertificates] = useState<Certificate[]>([])

  const { data, error, loading } = useSubscription(WATCH_CERTIFICATES, {
    variables: {
      filter,
    },
  })

  useEffect(() => {
    if (data && data.watchDeliveredCertificates) {
      setCertificates((c) => [data.watchDeliveredCertificates, ...c])
    }
  }, [data])

  return { certificates, error, loading }
}
