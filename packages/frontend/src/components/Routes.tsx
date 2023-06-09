import styled from '@emotion/styled'
import { Layout } from 'antd'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from '../routes/Home'
import _404 from '../routes/404'
import SubnetBlock from '../routes/SubnetBlock'
import Subnet from '../routes/Subnet'
import TCE from '../routes/TCE'
import SubnetTransaction from '../routes/SubnetTransaction'

const { Content: AntdContent } = Layout

const Root = styled(AntdContent)`
  min-height: 280px;
  padding: 1.5rem;
`

const Content = () => (
  <Root>
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/subnet" element={<Subnet />} />
      <Route
        path="/subnet/block/:blockHashOrNumber"
        element={<SubnetBlock />}
      />
      <Route
        path="/subnet/transaction/:transactionHash"
        element={<SubnetTransaction />}
      />
      <Route path="/tce" element={<TCE />} />
      <Route path="*" element={<_404 />} />
    </Routes>
  </Root>
)

export default Content
