import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { Alert, Layout as AntdLayout } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ErrorsContext } from './contexts/errors'
import { SelectedNetworksContext } from './contexts/selectedNetworks'
import { SubnetsContext } from './contexts/subnets'
import Content from './components/Routes'
import Footer from './components/Footer'
import Header from './components/Header'

import 'antd/dist/reset.css'
import useTheme from './hooks/useTheme'
import { SubnetWithId } from './types'
import useRegisteredSubnets from './hooks/useRegisteredSubnets'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { BlocksContext } from './contexts/blocks'
import useSubnetSubscribeToBlocks from './hooks/useSubnetSubscribeToBlocks'
import {
  RouteParamsFirstContext,
  RouteParamsProcessing,
} from './contexts/routeParamsFirst'
import useToposSubnetGetFromEndpoint from './hooks/useToposSubnetGetFromEndpoint'
import AppInternals from './AppInternals'
import { TourRefs, TourRefsContext } from './contexts/tourRefs'

const Errors = styled.div`
  margin: 1rem auto;
  width: 80%;
  max-width: 800px;
  z-index: 99999;
`

const Layout = styled(AntdLayout)`
  min-height: 100vh;
`

const App = () => {
  const theme = useTheme()
  const [routeParamsProcessing, setRouteParamsProcessing] =
    useState<RouteParamsProcessing>()
  const [selectedSubnet, setSelectedSubnet] = useState<SubnetWithId>()
  const [selectedToposSubnet, setSelectedToposSubnet] = useState<SubnetWithId>()
  const [selectedTCEEndpoint, setSelectedTCEEndpoint] = useState<string>()
  const [subnets, setSubnets] = useState<SubnetWithId[]>()
  const { blocks } = useSubnetSubscribeToBlocks(selectedSubnet)

  const [errors, setErrors] = useState<string[]>([])
  const { registeredSubnets } = useRegisteredSubnets(selectedToposSubnet)
  const { getToposSubnetFromEndpoint } = useToposSubnetGetFromEndpoint()

  const tourRefs = {
    MenuRef: useRef<HTMLDivElement>(null),
    NetworkSelectorRef: useRef<HTMLDivElement>(null),
    NetworkSelectorToposSubnetRef: useRef<HTMLButtonElement>(null),
    NetworkSelectorSubnetRef: useRef<HTMLButtonElement>(null),
    NetworkSelectorTCERef: useRef<HTMLButtonElement>(null),
  }

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri: selectedTCEEndpoint,
        cache: new InMemoryCache(),
      }),
    [selectedTCEEndpoint]
  )

  useEffect(function initToposAndTCEFromLocalStorage() {
    async function _() {
      const storedToposSubnetEndpoint = localStorage.getItem(
        'toposSubnetEndpoint'
      )
      if (storedToposSubnetEndpoint) {
        const toposSubnet = await getToposSubnetFromEndpoint(
          storedToposSubnetEndpoint
        )
        setSelectedToposSubnet(toposSubnet)
      }

      const storedTCEEndpoint = localStorage.getItem('tceEndpoint')
      if (storedTCEEndpoint) {
        setSelectedTCEEndpoint(storedTCEEndpoint)
      }
    }

    _()
  }, [])

  useEffect(
    function prependToposSubnetToSubnets() {
      if (selectedToposSubnet) {
        const subnets = [selectedToposSubnet, ...(registeredSubnets || [])]
        setSubnets(subnets)
      }
    },
    [selectedToposSubnet, registeredSubnets]
  )

  useEffect(
    function initSelectedSubnetFromLocalStorageAndRouteParams() {
      if (subnets && routeParamsProcessing?.isReady) {
        let subnet

        if (routeParamsProcessing.subnetId) {
          subnet = subnets.find((s) => s.id === routeParamsProcessing.subnetId)
        } else {
          const storedSubnetId = localStorage.getItem('subnetId')

          if (storedSubnetId) {
            subnet = subnets.find((s) => s.id === storedSubnetId)
          }
        }

        if (subnet) {
          setSelectedSubnet(subnet)
        }
      }
    },
    [routeParamsProcessing, subnets]
  )

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <RouteParamsFirstContext.Provider
          value={{ routeParamsProcessing, setRouteParamsProcessing }}
        >
          <ApolloProvider client={apolloClient}>
            <ErrorsContext.Provider value={{ setErrors }}>
              <SelectedNetworksContext.Provider
                value={{
                  selectedSubnet,
                  selectedTCEEndpoint,
                  selectedToposSubnet,
                  setSelectedSubnet,
                  setSelectedTCEEndpoint,
                  setSelectedToposSubnet,
                }}
              >
                <SubnetsContext.Provider value={{ data: subnets }}>
                  <BlocksContext.Provider value={blocks}>
                    <TourRefsContext.Provider value={tourRefs}>
                      <AppInternals>
                        <Layout>
                          <Header />
                          {Boolean(errors.length) && (
                            <Errors>
                              {errors.map((e) => (
                                <Alert
                                  type="error"
                                  showIcon
                                  closable
                                  message={e}
                                  key={e}
                                />
                              ))}
                            </Errors>
                          )}
                          <Content />
                          <Footer />
                        </Layout>
                      </AppInternals>
                    </TourRefsContext.Provider>
                  </BlocksContext.Provider>
                </SubnetsContext.Provider>
              </SelectedNetworksContext.Provider>
            </ErrorsContext.Provider>
          </ApolloProvider>
        </RouteParamsFirstContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
