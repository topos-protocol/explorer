import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { Alert, Layout as AntdLayout } from 'antd'
import React, { useEffect, useMemo } from 'react'
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
import { getToposSubnetFromEndpoint } from './components/ToposSubnetSelector'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

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
  const [selectedSubnet, setSelectedSubnet] = React.useState<SubnetWithId>()
  const [selectedToposSubnet, setSelectedToposSubnet] =
    React.useState<SubnetWithId>()
  const [selectedTCEEndpoint, setSelectedTCEEndpoint] = React.useState<string>()
  const [subnets, setSubnets] = React.useState<SubnetWithId[]>()
  const [errors, setErrors] = React.useState<string[]>([])
  const { registeredSubnets } = useRegisteredSubnets(selectedToposSubnet)

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        uri: selectedTCEEndpoint,
        cache: new InMemoryCache(),
      }),
    [selectedTCEEndpoint]
  )

  useEffect(function init() {
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
    function onToposSubnetSelected() {
      if (selectedToposSubnet) {
        const subnets = [selectedToposSubnet, ...(registeredSubnets || [])]
        setSubnets(subnets)

        const storedSubnetId = localStorage.getItem('subnetId')
        if (storedSubnetId) {
          const subnet = subnets.find((s) => s.id === storedSubnetId)
          if (subnet) {
            setSelectedSubnet(subnet)
          }
        }
      }
    },
    [selectedToposSubnet, registeredSubnets]
  )

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
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
              </SubnetsContext.Provider>
            </SelectedNetworksContext.Provider>
          </ErrorsContext.Provider>
        </ApolloProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
