import { Typography } from 'antd'

const { Text, Title } = Typography

import RouteContainer from '../components/RouteContainer'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import { useContext, useEffect } from 'react'

const Home = () => {
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)

  useEffect(
    function setPageReady() {
      if (setRouteParamsProcessing) {
        setRouteParamsProcessing({ isReady: true })
      }
    },
    [setRouteParamsProcessing]
  )

  return (
    <RouteContainer breadcrumbItems={[{ title: 'Home' }]}>
      <Title>Welcome to Topos Explorer 🚀</Title>
      <Text>Start by selecting networks on the top right corner!</Text>
    </RouteContainer>
  )
}

export default Home
