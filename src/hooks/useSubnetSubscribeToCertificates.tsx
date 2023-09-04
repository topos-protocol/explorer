import { useQuery } from '@apollo/client'
import { useEffect, useMemo, useRef, useState } from 'react'

import { graphql } from '../__generated__/gql'
// import { ErrorsContext } from '../contexts/errors'
import { Certificate } from '../types'
import { SourceStreamPosition } from '../__generated__/graphql'

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
  sourceSubnetIds?: Array<SourceStreamPosition>
}

export default function useSubnetSubscribeToCertificates({
  limit,
  sourceSubnetIds,
}: Options) {
  // const { setErrors } = React.useContext(ErrorsContext)
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [currentIndexes, setCurrentIndexes] = useState(
    new Map<string, number>()
  )
  const currentIndexesRef = useRef<Map<string, number> | null>(null)
  const [storedPositions, setStoredPositions] = useState(
    new Map<string, number>()
  )
  const definedLimit = useMemo(() => limit || DEFAULT_LIMIT, [limit])

  useEffect(
    function storeLatestCurrentIndexes() {
      currentIndexesRef.current = currentIndexes
    },
    [currentIndexes]
  )

  useEffect(
    function onNewSourceSubnetIds() {
      const newStoredPositions = storedPositions
      const newCurrentIndexes = currentIndexes

      sourceSubnetIds?.forEach(({ position, sourceSubnetId }) => {
        if (
          storedPositions.get(sourceSubnetId.value) === undefined &&
          position !== undefined
        ) {
          newStoredPositions.set(sourceSubnetId.value, position)
          newCurrentIndexes.set(sourceSubnetId.value, 0)
        }
      })

      setStoredPositions(newStoredPositions)
      setCurrentIndexes(newCurrentIndexes)
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
              ? (currentIndexesRef.current?.get(id) || 0) + position
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
      const latestCurrentIndexes = currentIndexesRef.current

      if (
        data?.certificates &&
        data?.certificates.length &&
        latestCurrentIndexes
      ) {
        const newCurrentIndexes = latestCurrentIndexes
        const newCertificates: Certificate[] = []

        data.certificates.forEach((certificate) => {
          const currentIndex = newCurrentIndexes.get(certificate.sourceSubnetId)

          if (currentIndex !== undefined) {
            newCurrentIndexes.set(certificate.sourceSubnetId, currentIndex + 1)

            const sourcePosition = storedPositions.get(
              certificate.sourceSubnetId
            )
            newCertificates.push({
              ...certificate,
              position: sourcePosition
                ? sourcePosition + currentIndex
                : undefined,
            })
          }
        })

        setCurrentIndexes(newCurrentIndexes)
        setCertificates((c) => [...newCertificates, ...c])
      }
    },
    [data?.certificates]
  )

  return { certificates, error, loading }
}
