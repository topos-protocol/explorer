import { BlockOutlined, PartitionOutlined } from '@ant-design/icons'
import { useTheme } from '@emotion/react'
import { FloatButton, Modal } from 'antd'
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

import logo from '../logo.svg'
import logoWhite from '../logo_white.svg'
import ToposSubnetSelector from './ToposSubnetSelector'
import SubnetSelector from './SubnetSelector'
import TCESelector from './TCESelector'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'

interface ShowModals {
  subnet?: boolean
  tce?: boolean
  toposSubnet?: boolean
}

const EndpointsMenu = () => {
  const toposSubnetButtonRef = useRef<any>()
  const theme = useTheme()
  const { selectedSubnet, selectedTCEEndpoint, selectedToposSubnet } =
    useContext(SelectedNetworksContext)
  const [showModals, setShowModals] = useState<ShowModals>({})

  const toggleModal = useCallback((type: keyof ShowModals) => {
    setShowModals((v) => ({ ...v, [type]: !v[type] }))
  }, [])

  const toposSubnetButtonElementRect = useMemo<DOMRect>(
    () => toposSubnetButtonRef?.current?.getBoundingClientRect(),
    [toposSubnetButtonRef.current]
  )

  return (
    <>
      <FloatButton.Group shape="square" style={{ top: 24, right: 24 }}>
        <FloatButton
          icon={
            <img
              src={selectedToposSubnet ? logo : logoWhite}
              width={22}
              alt="Topos Subnet"
            />
          }
          ref={toposSubnetButtonRef}
          tooltip="Select a Topos Subnet endpoint"
          onClick={() => toggleModal('toposSubnet')}
        />
        <FloatButton
          icon={
            <BlockOutlined
              style={{ color: selectedSubnet ? theme.colorPrimary : 'default' }}
            />
          }
          description={selectedSubnet ? selectedSubnet.name : ''}
          tooltip="Select a subnet"
          onClick={() => toggleModal('subnet')}
        />
        <FloatButton
          icon={
            <PartitionOutlined
              style={{
                color: selectedTCEEndpoint ? theme.colorPrimary : 'default',
              }}
            />
          }
          tooltip="Select a TCE endpoint"
          onClick={() => toggleModal('tce')}
        />
      </FloatButton.Group>
      <Modal
        open={showModals.toposSubnet}
        footer={null}
        onCancel={() => toggleModal('toposSubnet')}
        style={{
          marginRight: 0,
          top: toposSubnetButtonElementRect?.top,
          right: window.innerWidth - toposSubnetButtonElementRect?.left + 24,
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
          top: toposSubnetButtonElementRect?.top + 40,
          right: window.innerWidth - toposSubnetButtonElementRect?.left + 24,
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
          top: toposSubnetButtonElementRect?.top + 80,
          right: window.innerWidth - toposSubnetButtonElementRect?.left + 24,
        }}
      >
        <TCESelector />
      </Modal>
    </>
  )
}

export default EndpointsMenu
