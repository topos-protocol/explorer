import styled from '@emotion/styled'
import React from 'react'
import { Link as _Link } from 'react-router-dom'

const Link = styled(_Link)`
  color: ${({ theme }) => theme.colorPrimary};
`

export default Link
