import { useQuery } from '@apollo/client'
import React from 'react'

import { graphql } from '../__generated__/gql'
import { ErrorsContext } from '../contexts/errors'
import { SubnetsContext } from '../contexts/subnets'

const DEFAULT_SKIP = 0
const DEFAULT_LIMIT = 10

const GET_CERTIFICATES = graphql(`
  query Certificate($fromSourceCheckpoint: SourceCheckpoint!, $limit: Int!) {
    certificates(fromSourceCheckpoint: $fromSourceCheckpoint, first: $limit) {
      prevId
      id
      proof
      signature
      sourceSubnetId
      stateRoot
      targetSubnets {
        value
      }
      txRootHash
      verifier
    }
  }
`)

interface Options {
  limit?: number
  skip?: number
  sourceSubnetIds?: string[]
}

export default function useSubnetsCertificates(
  { limit, skip, sourceSubnetIds }: Options = {
    limit: DEFAULT_LIMIT,
    skip: DEFAULT_SKIP,
    sourceSubnetIds: undefined,
  }
) {
  const { setErrors } = React.useContext(ErrorsContext)
  const { data: subnets } = React.useContext(SubnetsContext)

  const { error, loading, data } = useQuery(GET_CERTIFICATES, {
    variables: {
      fromSourceCheckpoint: {
        sourceSubnetIds:
          sourceSubnetIds?.map((i) => ({ value: i })) ||
          subnets?.map((s) => ({ value: s.id })) ||
          [],
        positions:
          sourceSubnetIds?.map((i) => ({
            sourceSubnetId: { value: i },
            position: 0,
          })) ||
          subnets?.map((s) => ({
            sourceSubnetId: { value: s.id },
            position: 0,
          })) ||
          [],
      },
      limit: limit || DEFAULT_LIMIT,
    },
  })

  return { certificates: data?.certificates, error, loading }
}
