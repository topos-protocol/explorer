import { Menu as AntdMenu } from 'antd'
import { MutableRefObject, useContext, useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { TourRefsContext } from '../contexts/tourRefs'

const Menu = () => {
  const { pathname } = useLocation()
  const { MenuRef } = useContext(TourRefsContext)

  const items = useMemo(
    () => [
      {
        key: 'subnet',
        label: <NavLink to="/subnet">Subnet</NavLink>,
        rootpath: '/subnet',
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
    <div ref={MenuRef}>
      <AntdMenu
        theme="dark"
        disabledOverflow={true}
        mode="horizontal"
        items={items}
        selectedKeys={selectedKeys}
      />
    </div>
  )
}

export default Menu
