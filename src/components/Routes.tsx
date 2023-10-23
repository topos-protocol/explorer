import styled from '@emotion/styled'
import { Layout } from 'antd'
import { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Route, Routes as RouterRoutes } from 'react-router-dom'

import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import _404 from '../routes/404'
import CrossSubnetMessages from '../routes/CrossSubnetMessages'
import Home from '../routes/Home'
import Subnet from '../routes/Subnet'
import SubnetAccount from '../routes/SubnetAccount'
import SubnetBlock from '../routes/SubnetBlock'
import SubnetBlocks from '../routes/SubnetBlocks'
import SubnetCertificate from '../routes/SubnetCertificate'
import SubnetCertificates from '../routes/SubnetCertificates'
import SubnetTransaction from '../routes/SubnetTransaction'
import LoadingScreen from './LoadingScreen'

const { Content: AntdContent } = Layout

const Root = styled(AntdContent)`
  min-height: 280px;
  padding: 1.5rem;
`

const Routes = () => {
  const { routeParamsProcessing } = useContext(RouteParamsFirstContext)
  const isRouteParamsReadyRef = useRef(false)
  const [isRouteParamsReadyLocal, setIsRouteParamsReadyLocal] = useState(false)

  useEffect(
    function setMinDelayLoadingScreen() {
      if (
        isRouteParamsReadyRef.current === false &&
        routeParamsProcessing?.isReady === true
      ) {
        setTimeout(() => {
          setIsRouteParamsReadyLocal(true)
        }, 1000)

        isRouteParamsReadyRef.current = true
      }
    },
    [routeParamsProcessing?.isReady]
  )

  return (
    <Root>
      {!isRouteParamsReadyLocal &&
        createPortal(<LoadingScreen />, document.body)}
      <RouterRoutes>
        <Route index path="/" element={<Home />} />
        <Route path="/subnet" element={<Subnet />} />
        <Route
          path="/subnet/:subnetId/block/:blockHashOrNumber"
          element={<SubnetBlock />}
        />
        <Route
          path="/subnet/:subnetId/transaction/:transactionHash"
          element={<SubnetTransaction />}
        />
        <Route path="/subnet/:subnetId/blocks" element={<SubnetBlocks />} />
        <Route
          path="/subnet/:subnetId/certificates"
          element={<SubnetCertificates />}
        />
        <Route
          path="/subnet/:subnetId/certificate/:certificatePositionOrId"
          element={<SubnetCertificate />}
        />
        <Route
          path="/subnet/:subnetId/account/:accountAddress"
          element={<SubnetAccount />}
        />
        <Route
          path="/cross-subnet-messages"
          element={<CrossSubnetMessages />}
        />
        <Route path="*" element={<_404 />} />
      </RouterRoutes>
    </Root>
  )
}

export default Routes
