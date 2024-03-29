import { useQuery } from '@apollo/client'

import { graphql } from '../__generated__/gql'
import { useContext, useEffect, useState } from 'react'
import { ErrorsContext } from '../contexts/errors'
import { Certificate } from '../__generated__/graphql'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
// import { ErrorsContext } from '../contexts/errors'

const GET_CERTIFICATE = graphql(`
  query Certificate($certificateId: String!) {
    certificate(certificateId: $certificateId) {
      prevId
      id
      positions {
        source {
          sourceSubnetId
          position
        }
      }
      proof
      signature
      sourceSubnetId
      stateRoot
      targetSubnets
      receiptsRootHash
      txRootHash
      verifier
    }
  }
`)

interface Options {
  certificateId?: string
  sourceSubnetId?: string
}

export default function useSubnetGetCertificateById({
  certificateId,
}: Options = {}) {
  const { setErrors } = useContext(ErrorsContext)
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const [certificate, setCertificate] = useState<Certificate>()

  const { data, error, loading } = useQuery(GET_CERTIFICATE, {
    variables: {
      certificateId: certificateId || '',
    },
  })

  useEffect(
    function processCertificate() {
      if (data) {
        if (
          !data?.certificate ||
          (data.certificate.sourceSubnetId !== selectedSubnet?.id &&
            selectedSubnet)
        ) {
          setErrors((e) => [
            ...e,
            `Could not find a certificate with the provided id (${certificateId})`,
          ])
          setCertificate(undefined)
        } else {
          setCertificate(data?.certificate)
        }
      }
    },
    [data?.certificate, selectedSubnet]
  )

  return { certificate, error, loading }
}
