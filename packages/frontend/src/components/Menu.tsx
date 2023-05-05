import { Menu as AntdMenu } from 'antd'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Menu = () => {
  const { pathname } = useLocation()

  const items = React.useMemo(
    () => [
      {
        label: <Link to="/subnets">Subnets</Link>,
        key: 'subnets',
        rootpath: '/subnets',
      },
      { label: <Link to="/tce">TCE</Link>, key: 'tce', rootpath: '/tce' },
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
