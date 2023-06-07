import { Menu as AntdMenu } from 'antd'
import React, { useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Menu = () => {
  const { pathname } = useLocation()

  const items = React.useMemo(
    () => [
      {
        key: 'subnet',
        label: <NavLink to="/subnet">Subnet</NavLink>,
        rootpath: '/subnet',
      },
      {
        key: 'tce',
        label: <NavLink to="/tce">TCE</NavLink>,
        rootpath: '/tce',
      },
    ],
    []
  )

  const selectedKeys = React.useMemo(
    () =>
      items
        .filter((i) => pathname.indexOf(i.rootpath) !== -1)
        .map((i) => i.key),
    [items, pathname]
  )

  return (
    <AntdMenu
      theme="dark"
      disabledOverflow={true}
      mode="horizontal"
      items={items}
      selectedKeys={selectedKeys}
    />
  )
}

export default Menu
