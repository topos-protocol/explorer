import { Button, Result, Space, Tour } from 'antd'
import type { TourProps } from 'antd'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import RouteContainer from '../components/RouteContainer'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'
import { TourRefsContext } from '../contexts/tourRefs'
import logo from '../logo.svg'

const Home = () => {
  const { setRouteParamsProcessing } = useContext(RouteParamsFirstContext)
  const {
    MenuRef,
    NetworkSelectorRef,
    NetworkSelectorToposSubnetRef,
    NetworkSelectorSubnetRef,
    NetworkSelectorTCERef,
  } = useContext(TourRefsContext)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const testRef = useRef(null)

  useEffect(
    function setPageReady() {
      if (setRouteParamsProcessing) {
        setRouteParamsProcessing({ isReady: true })
      }
    },
    [setRouteParamsProcessing]
  )

  const tourSteps = useMemo<TourProps['steps']>(() => {
    const steps = []

    if (NetworkSelectorRef?.current) {
      steps.push({
        title: 'Network Menu',
        description:
          'The Network Menu allows you to select which network you want to explore and from which endpoint',
        target: () => NetworkSelectorRef?.current as HTMLElement,
      })
    }

    if (NetworkSelectorToposSubnetRef?.current) {
      steps.push({
        title: 'Topos Subnet endpoint',
        description:
          'First, select the RPC endpoint you want to use to reach a Topos Subnet node (e.g., a listed RPC endpoint that an entity exposes or (soon) your own local node)',
        target: () => NetworkSelectorToposSubnetRef?.current as HTMLElement,
      })
    }

    if (NetworkSelectorSubnetRef?.current) {
      steps.push({
        title: 'Subnet',
        description:
          'Then, now that you are connected to a Topos Subnet node, you can select which registered subnet to explore',
        target: () => NetworkSelectorSubnetRef?.current as HTMLElement,
      })
    }

    if (NetworkSelectorTCERef?.current) {
      steps.push({
        title: 'TCE',
        description:
          'Finally, you can select the TCE graphql endpoint to use to query certificates from the TCE',
        target: () => NetworkSelectorTCERef?.current as HTMLElement,
      })
    }

    if (MenuRef?.current) {
      steps.push({
        title: 'Main Menu',
        description:
          'Once you have selected all networks with Network Menu, you can access the Subnet page to explore the selected subnet, or the Cross-Subnet Messages page to visualize cross-subnet messages exchanged between subnets in the Topos ecosystem',
        target: () => MenuRef?.current as HTMLElement,
      })
    }

    return steps
  }, [MenuRef?.current, NetworkSelectorRef?.current])

  const startTour = useCallback(() => {
    setIsTourOpen(true)
  }, [])

  const closeTour = useCallback(() => {
    setIsTourOpen(false)
  }, [])

  return (
    <RouteContainer breadcrumbItems={[{ title: 'Home' }]}>
      <Result
        title="Welcome to Topos Explorer 🚀"
        subTitle={
          <Space direction="vertical">
            <div ref={testRef}>
              Start exploring by selecting networks on the top right corner!
            </div>
            <Button type="primary" onClick={startTour}>
              Show me around
            </Button>
          </Space>
        }
        icon={<img src={logo} width={200} />}
      />
      <Tour open={isTourOpen} onClose={closeTour} steps={tourSteps} />
    </RouteContainer>
  )
}

export default Home
