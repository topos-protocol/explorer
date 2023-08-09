import { Menu as AntdMenu } from 'antd'
import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Menu = () => {
  const { pathname } = useLocation()

  const items = useMemo(
    () => [
      {
        key: 'subnet',
        label: <NavLink to="/subnet">Subnet</NavLink>,
        rootpath: '/subnet',
      },
      {
        key: 'certificates',
        label: <NavLink to="/certificates">Certificates</NavLink>,
        rootpath: '/certificates',
      },
      {
        key: 'cross-subnet-messages',
        label: (
          <NavLink to="/cross-subnet-messages">Cross-Subnet Messages</NavLink>
        ),
        rootpath: '/cross-subnet-messages',
      },
    ],
    []
  )

  const selectedKeys = useMemo(
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
