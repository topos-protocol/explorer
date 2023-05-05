import { theme } from 'antd'
import React from 'react'

export default function useTheme() {
  const { token } = theme.useToken()
  token.colorPrimary = '#27c794'

  return token
}
