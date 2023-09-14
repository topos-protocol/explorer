import styled from '@emotion/styled'
import { CoffeeOutlined } from '@ant-design/icons'
import { Result as _Result } from 'antd'

import Link from '../components/Link'
import { useContext, useEffect } from 'react'
import { RouteParamsFirstContext } from '../contexts/routeParamsFirst'

const Result = styled(_Result)`
  .ant-result-icon {
    visibility: hidden;
  }
`

const _404 = () => {
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
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      icon={<CoffeeOutlined />}
      extra={<Link to="/">Back Home</Link>}
    />
  )
}

export default _404
