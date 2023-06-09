import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client'
import { Certificate } from '@topos-network/topos-grpc-client-stub/generated/topos/uci/v1/certification_pb'
import { WatchCertificatesResponse } from '@topos-network/topos-grpc-client-stub/generated/topos/tce/v1/api_pb'
import React, { useEffect, useMemo } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { SubnetsContext } from '../contexts/subnets'

export default function useSubnetsCertificates() {
  const { setErrors } = React.useContext(ErrorsContext)
  const { data: subnets } = React.useContext(SubnetsContext)
  const [certificates, setCertificates] = React.useState<
    Certificate.AsObject[]
  >([])

  const client = useMemo(
    () =>
      new ApolloClient({
        uri: 'http://localhost:4000',
        cache: new InMemoryCache(),
      }),
    []
  )

  useEffect(
    function init() {
      if (client) {
        client
          .query({
            query: gql`
              query {
                certificates(
                  fromSourceCheckpoint: {
                    sourceSubnetIds: [
                      {
                        value: "0x3131313131313131313131313131313131313131313131313131313131313131"
                      }
                    ]
                    positions: [
                      {
                        sourceSubnetId: {
                          value: "0x3131313131313131313131313131313131313131313131313131313131313131"
                        }
                        position: 0
                      }
                    ]
                  }
                  first: 10
                ) {
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
            `,
          })
          .then((result) => console.log(result))
          .catch(console.error)
      }
    },
    [client]
  )

  useEffect(
    function watch() {
      if (subnets) {
        const subnetIds = subnets?.map((subnet) =>
          subnet?.id.startsWith('0x') ? subnet.id.substring(2) : subnet?.id
        )

        const eventSource = new EventSource(
          `api/grpc/watch?${subnetIds?.reduce((acc, curr, index, array) => {
            if (array.length) {
              if (index === 0) {
                acc = `subnetIds[]=${curr}`
              } else {
                acc = `${acc}&subnetIds[]=${curr}`
              }
            }

            return acc
          }, '')}`
        )

        eventSource.onmessage = ({ data }) => {
          const _data: WatchCertificatesResponse.AsObject = JSON.parse(data)

          if (_data.certificatePushed && _data.certificatePushed.certificate) {
            setCertificates((c) => [
              ...c,
              _data.certificatePushed!.certificate!,
            ])
          }
        }

        eventSource.onerror = (error) => {
          console.error(error)
          eventSource.close()
        }

        return function cleanup() {
          setCertificates([])
          eventSource.close()
        }
      }
    },
    [subnets]
  )

  return { certificates }
}
