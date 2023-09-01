import styled from '@emotion/styled'
import { Layout } from 'antd'
import { Route, Routes as RouterRoutes } from 'react-router-dom'

import Home from '../routes/Home'
import _404 from '../routes/404'
import SubnetBlock from '../routes/SubnetBlock'
import Subnet from '../routes/Subnet'
import Certificates from '../routes/Certificates'
import CrossSubnetMessages from '../routes/CrossSubnetMessages'
import SubnetTransaction from '../routes/SubnetTransaction'

const { Content: AntdContent } = Layout

const Root = styled(AntdContent)`
  min-height: 280px;
  padding: 1.5rem;
`

const Routes = () => (
  <Root>
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
      <Route path="/cross-subnet-messages" element={<CrossSubnetMessages />} />
      <Route path="*" element={<_404 />} />
    </RouterRoutes>
  </Root>
)

export default Routes
