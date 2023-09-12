import { useQuery } from '@apollo/client'

import { graphql } from '../__generated__/gql'
// import { ErrorsContext } from '../contexts/errors'

const GET_CERTIFICATE = graphql(`
  query Certificate($certificateId: CertificateId!) {
    certificate(certificateId: $certificateId) {
      prevId
      id
      proof
      signature
      sourceSubnetId
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
  certificateId?: string
}

export default function useSubnetGetCertificateById({
  certificateId,
}: Options = {}) {
  // const { setErrors } = React.useContext(ErrorsContext)

  const { data, error, loading } = useQuery(GET_CERTIFICATE, {
    variables: {
      certificateId: {
        value: certificateId || '',
      },
    },
  })

  return { certificate: data?.certificate, error, loading }
}
