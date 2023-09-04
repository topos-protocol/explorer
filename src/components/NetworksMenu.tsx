import { BlockOutlined, PartitionOutlined } from '@ant-design/icons'
import { useTheme } from '@emotion/react'
import { FloatButton, Modal, Space, Typography } from 'antd'
import { useCallback, useContext, useMemo, useState } from 'react'

import logo from '../logo.svg'
import logoWhite from '../logo_white.svg'
import ToposSubnetSelector from './ToposSubnetSelector'
import SubnetSelector from './SubnetSelector'
import TCESelector from './TCESelector'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import { TourRefsContext } from '../contexts/tourRefs'

const { Text } = Typography

interface ShowModals {
  subnet?: boolean
  tce?: boolean
  toposSubnet?: boolean
}

const NetworksMenu = () => {
  const theme = useTheme()
  const { selectedSubnet, selectedTCEEndpoint, selectedToposSubnet } =
    useContext(SelectedNetworksContext)
  const {
    NetworkSelectorRef,
    NetworkSelectorSubnetRef,
    NetworkSelectorTCERef,
    NetworkSelectorToposSubnetRef,
  } = useContext(TourRefsContext)
  const [showModals, setShowModals] = useState<ShowModals>({})

  const toggleModal = useCallback((type: keyof ShowModals) => {
    setShowModals((v) => ({ ...v, [type]: !v[type] }))
  }, [])

  const toposSubnetButtonElementRect = useMemo<DOMRect | undefined>(
    () =>
      NetworkSelectorToposSubnetRef?.current != undefined
        ? NetworkSelectorToposSubnetRef?.current.getBoundingClientRect()
        : undefined,
    [NetworkSelectorToposSubnetRef?.current]
  )

  return (
    <>
      <FloatButton.Group shape="square" style={{ top: 24, right: 24 }}>
        <div ref={NetworkSelectorRef}>
          <FloatButton
            icon={
              <img
                src={selectedToposSubnet ? logo : logoWhite}
                width={20}
                alt="Topos Subnet"
              />
            }
            ref={NetworkSelectorToposSubnetRef}
            tooltip={
              <Space direction="vertical" size={0}>
                <Text>Select a Topos Subnet endpoint</Text>
                {Boolean(selectedToposSubnet) && (
                  <Text
                    strong
                  >{`(currently: ${selectedToposSubnet?.endpoint})`}</Text>
                )}
              </Space>
            }
            onClick={() => toggleModal('toposSubnet')}
          />
          <FloatButton
            icon={
              selectedSubnet ? (
                <img
                  src={selectedSubnet.logoURL}
                  width={20}
                  alt={selectedSubnet.name}
                />
              ) : (
                <BlockOutlined />
              )
            }
            ref={NetworkSelectorSubnetRef}
            tooltip={
              <Space direction="vertical" size={0}>
                <Text>Select a subnet</Text>
                {Boolean(selectedSubnet) && (
                  <Text strong>{`(currently: ${selectedSubnet?.name})`}</Text>
                )}
                {Boolean(!selectedToposSubnet) && (
                  <Text strong>Select a Topos Subnet endpoint first!</Text>
                )}
              </Space>
            }
            onClick={() => (selectedToposSubnet ? toggleModal('subnet') : null)}
          />
          <FloatButton
            icon={
              <PartitionOutlined
                style={{
                  color: selectedTCEEndpoint ? theme.colorPrimary : 'default',
                }}
              />
            }
            ref={NetworkSelectorTCERef}
            tooltip={
              <Space direction="vertical" size={0}>
                <Text>Select a TCE endpoint</Text>
                {Boolean(selectedTCEEndpoint) && (
                  <Text strong>{`(currently: ${selectedTCEEndpoint})`}</Text>
                )}
              </Space>
            }
            onClick={() => toggleModal('tce')}
          />
        </div>
      </FloatButton.Group>
      <Modal
        open={showModals.toposSubnet}
        footer={null}
        onCancel={() => toggleModal('toposSubnet')}
        style={{
          marginRight: 0,
          top: toposSubnetButtonElementRect?.top,
          right: window.innerWidth - toposSubnetButtonElementRect?.left! + 24,
        }}
      >
        <ToposSubnetSelector />
      </Modal>
      <Modal
        open={showModals.subnet}
        footer={null}
        onCancel={() => toggleModal('subnet')}
        style={{
          marginRight: 0,
          top: toposSubnetButtonElementRect?.top! + 40,
          right: window.innerWidth - toposSubnetButtonElementRect?.left! + 24,
        }}
      >
        <SubnetSelector />
      </Modal>
      <Modal
        open={showModals.tce}
        footer={null}
        onCancel={() => toggleModal('tce')}
        style={{
          marginRight: 0,
          top: toposSubnetButtonElementRect?.top! + 80,
          right: window.innerWidth - toposSubnetButtonElementRect?.left! + 24,
        }}
      >
        <TCESelector />
      </Modal>
    </>
  )
}

export default NetworksMenu
