import styled from '@emotion/styled'
import { Layout } from 'antd'
import { createPortal } from 'react-dom'
import { Route, Routes as RouterRoutes } from 'react-router-dom'

import Home from '../routes/Home'
import _404 from '../routes/404'
import SubnetBlock from '../routes/SubnetBlock'
import Subnet from '../routes/Subnet'
import Certificates from '../routes/Certificates'
import CrossSubnetMessages from '../routes/CrossSubnetMessages'
import SubnetTransaction from '../routes/SubnetTransaction'
import SubnetCertificate from '../routes/SubnetCertificate'
import LoadingScreen from './LoadingScreen'
import { useContext, useEffect, useRef, useState } from 'react'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'

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
        <Route path="/certificates" element={<Certificates />} />
        <Route
          path="/subnet/:subnetId/certificate/:certificatePositionOrId"
          element={<SubnetCertificate />}
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
