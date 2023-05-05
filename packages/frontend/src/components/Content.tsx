import styled from '@emotion/styled'
import { Breadcrumb, Layout } from 'antd'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from '../routes/Home'
import Subnets from '../routes/Subnets'
import TCE from '../routes/TCE'
import ToposSubnetSelector from './ToposSubnetSelector'

const { Content: AntdContent } = Layout

const Root = styled(AntdContent)`
  min-height: 280px;
  padding: 1.5rem;
`

const Content = () => (
  <Root>
    <ToposSubnetSelector />
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/subnets" element={<Subnets />} />
      <Route path="/tce" element={<TCE />} />
    </Routes>
  </Root>
)

export default Content
