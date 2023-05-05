import { Typography } from 'antd'
import React from 'react'

const { Text } = Typography

import RouteContainer from '../components/RouteContainer'

const Home = () => (
  <RouteContainer breadcrumbItems={[{ title: 'Home' }]}>
    <Text>Home</Text>
  </RouteContainer>
)

export default Home
