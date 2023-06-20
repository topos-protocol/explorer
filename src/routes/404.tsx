import styled from '@emotion/styled'
import { CoffeeOutlined } from '@ant-design/icons'
import { Result as _Result } from 'antd'
import React from 'react'

import Link from '../components/Link'

const Result = styled(_Result)`
  .ant-result-icon {
    visibility: hidden;
  }
`

const _404 = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    icon={<CoffeeOutlined />}
    extra={<Link to="/">Back Home</Link>}
  />
)

export default _404
