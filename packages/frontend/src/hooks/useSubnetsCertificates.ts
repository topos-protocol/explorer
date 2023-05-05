import { Certificate } from '@topos-network/topos-grpc-client-stub/generated/topos/uci/v1/certification_pb'
import { WatchCertificatesResponse } from '@topos-network/topos-grpc-client-stub/generated/topos/tce/v1/api_pb'
import React, { useEffect } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { SubnetsContext } from '../contexts/subnets'

export default function useSubnetsCertificates() {
  const { setErrors } = React.useContext(ErrorsContext)
  const { data: subnets } = React.useContext(SubnetsContext)
  const [certificates, setCertificates] = React.useState<
    Certificate.AsObject[]
  >([])

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
