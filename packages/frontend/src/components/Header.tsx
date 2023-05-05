import { Layout, Space } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../logo.svg'
import Menu from './Menu'

const { Header: AntdHeader } = Layout

const Header = () => (
  <AntdHeader>
    <Space>
      <Link to="/">
        <Space align="start">
          <img src={logo} width={40} alt="logo" />
          <h3
            style={{
              color: '#fff',
              fontWeight: 'bold',
              marginBottom: 0,
              marginRight: '2rem',
            }}
          >
            Topos Explorer
          </h3>
        </Space>
      </Link>
      <Menu />
    </Space>
  </AntdHeader>
)

export default Header
