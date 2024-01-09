import { useQuery } from '@apollo/client'
import { useEffect, useMemo, useRef, useState } from 'react'

import { graphql } from '../__generated__/gql'
// import { ErrorsContext } from '../contexts/errors'
import { Certificate } from '../types'
import { SourceStreamPosition } from '../__generated__/graphql'

const DEFAULT_LIMIT = 10

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
  const uniqueSourceSubnetId = useRef<string | null>(null)
  const definedLimit = useMemo(() => limit || DEFAULT_LIMIT, [limit])

  useEffect(
    function storeLatestCurrentIndexes() {
      window.setTimeout(() => {
        currentIndexesRef.current = currentIndexes
      }, 500)
    },
    [currentIndexes]
  )

  useEffect(
    function onNewSourceSubnetIds() {
      let newStoredPositions = storedPositions
      let newCurrentIndexes = currentIndexes

      sourceSubnetIds?.forEach(({ position, sourceSubnetId }) => {
        if (
          storedPositions.get(sourceSubnetId.value) === undefined &&
          position !== undefined
        ) {
          newStoredPositions.set(sourceSubnetId.value, position)
          newCurrentIndexes.set(sourceSubnetId.value, 0)
        }
      })

      // Temp: clean certificates when subscription is to one subnet only and that subnet changes
      if (
        sourceSubnetIds?.length === 1 &&
        sourceSubnetIds[0].sourceSubnetId.value !== uniqueSourceSubnetId.current
      ) {
        uniqueSourceSubnetId.current = sourceSubnetIds[0].sourceSubnetId.value
        newStoredPositions = new Map<string, number>()
        newCurrentIndexes = new Map<string, number>()
        newCurrentIndexes.set(sourceSubnetIds[0].sourceSubnetId.value, 0)
        setCertificates([])
      }

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
          const currentIndex = newCurrentIndexes.get(
            certificate.sourceSubnetId.value
          )

          if (currentIndex !== undefined) {
            newCurrentIndexes.set(
              certificate.sourceSubnetId.value,
              currentIndex + 1
            )

            const sourcePosition = storedPositions.get(
              certificate.sourceSubnetId.value
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
