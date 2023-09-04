import styled from '@emotion/styled'
import { Spin } from 'antd'

const Root = styled.div`
  position: fixed;
  z-index: 9999;
  overflow: hidden;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoadingScreen = () => (
  <Root>
    <Spin size="large" />
  </Root>
)

export default LoadingScreen
