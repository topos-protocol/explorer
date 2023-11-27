import { useQuery } from '@apollo/client'
import { useMemo } from 'react'

import { graphql } from '../__generated__/gql'
import { SourceStreamPosition } from '../__generated__/graphql'

const DEFAULT_LIMIT = 10
const DEFAULT_SKIP = 0

const GET_CERTIFICATES = graphql(`
  query Certificates($fromSourceCheckpoint: SourceCheckpoint!, $limit: Int!) {
    certificates(fromSourceCheckpoint: $fromSourceCheckpoint, first: $limit) {
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
  limit?: number
  skip?: number
  sourceStreamPosition?: Partial<SourceStreamPosition>
}

export default function useSubnetGetCertificates({
  limit,
  skip,
  sourceStreamPosition,
}: Options = {}) {
  const definedLimit = useMemo(() => limit || DEFAULT_LIMIT, [limit])
  const definedSkip = useMemo(() => skip || DEFAULT_SKIP, [skip])

  const { data, error, loading } = useQuery(GET_CERTIFICATES, {
    variables: {
      fromSourceCheckpoint: {
        sourceSubnetIds:
          sourceStreamPosition && sourceStreamPosition.sourceSubnetId
            ? [sourceStreamPosition.sourceSubnetId]
            : [],
        positions:
          sourceStreamPosition && sourceStreamPosition.sourceSubnetId
            ? [
                {
                  sourceSubnetId: sourceStreamPosition.sourceSubnetId,
                  position:
                    sourceStreamPosition.position != undefined
                      ? isNaN(sourceStreamPosition.position!)
                        ? Infinity
                        : sourceStreamPosition.position
                      : definedSkip,
                },
              ]
            : [],
      },
      limit: definedLimit,
    },
    pollInterval: 2000,
  })

  const certificates = useMemo(
    () =>
      data?.certificates.map((certificate, index) => ({
        ...certificate,
        position: sourceStreamPosition?.position || definedSkip + index,
      })),
    [data]
  )

  return { certificates, error, loading }
}
