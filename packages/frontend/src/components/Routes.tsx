import styled from '@emotion/styled'
import { Layout } from 'antd'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from '../routes/Home'
import Subnet from '../routes/Subnet'
import TCE from '../routes/TCE'

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
      <Route path="/tce" element={<TCE />} />
    </Routes>
  </Root>
)

export default Content
