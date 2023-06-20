import { useQuery } from '@apollo/client'
import React from 'react'

import { graphql } from '../__generated__/gql'
import { ErrorsContext } from '../contexts/errors'
import { SubnetsContext } from '../contexts/subnets'

const GET_CERTIFICATES = graphql(`
  query Certificate($fromSourceCheckpoint: SourceCheckpoint!) {
    certificates(fromSourceCheckpoint: $fromSourceCheckpoint, first: 10) {
      prevId
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

export default function useSubnetsCertificates() {
  const { setErrors } = React.useContext(ErrorsContext)
  const { data: subnets } = React.useContext(SubnetsContext)

  const { error, loading, data } = useQuery(GET_CERTIFICATES, {
    variables: {
      fromSourceCheckpoint: {
        sourceSubnetIds: subnets?.map((s) => ({ value: s.id })) || [],
        positions:
          subnets?.map((s) => ({
            sourceSubnetId: { value: s.id },
            position: 0,
          })) || [],
      },
    },
  })

  return { certificates: data?.certificates, error, loading }
}
