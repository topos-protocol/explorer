import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { Alert, Layout as AntdLayout } from 'antd'
import { BigNumber } from 'ethers'
import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ErrorsContext } from './contexts/errors'
import { SelectedToposSubnetContext } from './contexts/selectedToposSubnet'
import { SubnetsContext } from './contexts/subnets'
import Content from './components/Routes'
import Footer from './components/Footer'
import Header from './components/Header'

import 'antd/dist/reset.css'
import useTheme from './hooks/useTheme'
import { SubnetWithId } from './types'
import useRegisteredSubnets from './hooks/useRegisteredSubnets'

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
  const [selectedToposSubnet, setSelectedToposSubnet] =
    React.useState<SubnetWithId>()
  const [subnets, setSubnets] = React.useState<SubnetWithId[]>()
  const [errors, setErrors] = React.useState<string[]>([])
  const { registeredSubnets } = useRegisteredSubnets(selectedToposSubnet)

  useEffect(
    function onToposSubnetSelected() {
      if (
        selectedToposSubnet &&
        // registeredSubnets &&
        // registeredSubnets.length
        true
      ) {
        setSubnets([selectedToposSubnet, ...(registeredSubnets || [])])
      }
    },
    [selectedToposSubnet, registeredSubnets]
  )

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ErrorsContext.Provider value={{ setErrors }}>
          <SelectedToposSubnetContext.Provider
            value={{ selectedToposSubnet, setSelectedToposSubnet }}
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
          </SelectedToposSubnetContext.Provider>
        </ErrorsContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
