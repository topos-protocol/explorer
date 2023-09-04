import { ReactNode, useContext } from 'react'

import { BlocksContext } from './contexts/blocks'
import { SelectedNetworksContext } from './contexts/selectedNetworks'
import useSubnetSubscribeToCertificates from './hooks/useSubnetSubscribeToCertificates'
import { CertificatesContext } from './contexts/certificates'

interface Props {
  children?: ReactNode
}

// INFO
// --
//
// This component is needed to query certificates at the root of the application
// because graphql queries cannot be executed at the same component level
// where the Apollo client is created

const AppInternals = ({ children }: Props) => {
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const blocks = useContext(BlocksContext)
  const { certificates } = useSubnetSubscribeToCertificates({
    sourceSubnetIds: selectedSubnet
      ? [
          {
            position: blocks[0]?.number,
            sourceSubnetId: { value: selectedSubnet.id },
          },
        ]
      : undefined,
    limit: 1,
  })

  return (
    <>
      <CertificatesContext.Provider value={certificates}>
        {children}
      </CertificatesContext.Provider>
    </>
  )
}

export default AppInternals
