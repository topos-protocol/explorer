import { useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'

import { graphql } from '../__generated__/gql'
// import { ErrorsContext } from '../contexts/errors'
import { Certificate } from '../types'

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
  sourceSubnetIds?: { position?: number; id: string }[]
}

export default function useSubnetSubscribeToCertificates({
  limit,
  sourceSubnetIds,
}: Options) {
  // const { setErrors } = React.useContext(ErrorsContext)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const definedLimit = useMemo(() => limit || DEFAULT_LIMIT, [])

  const [storedPositions, setStoredPositions] = useState(
    new Map<string, number>()
  )

  useEffect(
    function onSourceSubnetIdsUpdate() {
      sourceSubnetIds?.forEach(({ id, position }) => {
        if (storedPositions.get(id) === undefined && position !== undefined) {
          const newMap = storedPositions
          newMap.set(id, position)
          setStoredPositions(newMap)
        }
      })
    },
    [sourceSubnetIds]
  )

  const { data, error, loading } = useQuery(GET_CERTIFICATES, {
    variables: {
      fromSourceCheckpoint: {
        sourceSubnetIds: Array.from(storedPositions).map(([id]) => ({
          value: id,
        })),
        positions: Array.from(storedPositions).map(([id, position]) => {
          return {
            sourceSubnetId: { value: id },
            position: position
              ? currentIndex + position * definedLimit
              : Infinity,
          }
        }),
      },
      limit: definedLimit,
    },
    pollInterval: 2000,
  })

  useEffect(
    function appendCertificate() {
      if (data?.certificates && data.certificates[0]) {
        setCurrentIndex((i) => i + 1)
        setCertificates((c) => {
          const certificate = data?.certificates[0]
          const sourcePosition = storedPositions.get(certificate.sourceSubnetId)
          return [
            {
              ...certificate,
              position: sourcePosition
                ? sourcePosition + currentIndex
                : undefined,
            },
            ...c,
          ]
        })
      }
    },
    [data?.certificates]
  )

  return { certificates, error, loading }
}
