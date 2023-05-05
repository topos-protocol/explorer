import React from 'react'

import RouteContainer from '../components/RouteContainer'
import CertificateGraph from '../components/CertificateGraph'

const TCE = () => {
  return (
    <RouteContainer breadcrumbItems={[{ title: 'Subnets' }]}>
      <CertificateGraph />
    </RouteContainer>
  )
}

export default TCE
