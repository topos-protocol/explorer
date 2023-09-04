import styled from '@emotion/styled'
import { Link as _Link } from 'react-router-dom'

const Link = styled(_Link)`
  color: ${({ theme }) => theme.colorPrimary};
  &:hover {
    color: ${({ theme }) => theme.colorPrimaryHover} !important;
  }
`

export default Link
