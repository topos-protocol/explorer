import { Typography } from 'antd'
import React from 'react'

const { Text, Title } = Typography

import RouteContainer from '../components/RouteContainer'

const Home = () => (
  <RouteContainer breadcrumbItems={[{ title: 'Home' }]}>
    <Title>Welcome to Topos Explorer 🚀</Title>
    <Text>Start by selecting networks on the top right corner!</Text>
  </RouteContainer>
)

export default Home
