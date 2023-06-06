import { Descriptions, FloatButton, Layout, Modal, Space } from 'antd'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import logo from '../logo.svg'
import Menu from './Menu'
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons'
import ToposSubnetSelector from './ToposSubnetSelector'

const { Header: AntdHeader } = Layout

const Header = () => {
  const toposSubnetButtonRef = useRef()
  const [showSettings, setShowSettings] = useState(false)

  const handleModalOk = useCallback(() => {
    setShowSettings((v) => !v)
  }, [])

  const handleModalCancel = useCallback(() => {
    setShowSettings((v) => !v)
  }, [])

  const toposSubnetButtonElementRect = useMemo<DOMRect>(
    () => toposSubnetButtonRef?.current?.getBoundingClientRect(),
    [toposSubnetButtonRef.current]
  )

  return (
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
        <FloatButton.Group shape="square" style={{ top: 24, right: 24 }}>
          <FloatButton
            icon={<img src={logo} width={22} alt="Topos Subnet" />}
            ref={toposSubnetButtonRef}
            onClick={() => {
              setShowSettings((v) => !v)
            }}
          />
          <FloatButton />
          <FloatButton icon={<SyncOutlined />} />
        </FloatButton.Group>
        <Modal
          open={showSettings}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          style={{
            marginRight: 0,
            top: toposSubnetButtonElementRect?.top,
            right: window.innerWidth - toposSubnetButtonElementRect?.left + 24,
          }}
        >
          <ToposSubnetSelector />
        </Modal>
      </Space>
    </AntdHeader>
  )
}

export default Header
