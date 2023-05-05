import { PlusOutlined } from '@ant-design/icons'
import { Divider, Input, Select, Space, Button, Avatar, Typography } from 'antd'
import type { InputRef } from 'antd'
import React, { useContext, useState, useRef, useCallback } from 'react'

import { SelectedSubnetContext } from '../contexts/selectedSubnet'
import { SubnetsContext } from '../contexts/subnets'

const { Text } = Typography

let index = 0

interface Props {
  disabled?: boolean
}

const SubnetSelector = ({ disabled = false }: Props) => {
  const { data: subnets } = useContext(SubnetsContext)
  const { setSelectedSubnet } = useContext(SelectedSubnetContext)
  const [items, setItems] = useState(['http://localhost:8545'])
  const [name, setName] = useState('')
  const inputRef = useRef<InputRef>(null)

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault()
    setItems([...items, name || `New item ${index++}`])
    setName('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onValueChange = useCallback(
    (subnetId: string) => {
      if (setSelectedSubnet) {
        setSelectedSubnet(subnets?.find((s) => s.id === subnetId))
      }
    },
    [subnets, setSelectedSubnet]
  )

  return (
    <Select
      style={{ width: 300 }}
      placeholder="Select a subnet"
      disabled={disabled}
      onChange={onValueChange}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Space style={{ padding: '0 8px 4px' }}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add item
            </Button>
          </Space>
        </>
      )}
      options={[
        {
          label: 'Remote Subnets',
          options: subnets
            ? subnets.map((s) => ({
                label: (
                  <Space>
                    <Avatar size="small" src={s.logoURL} />
                    <Text>{s.name}</Text>
                  </Space>
                ),
                value: s.id,
              }))
            : [],
        },
        {
          label: 'Custom',
          options: items?.map((item) => ({ label: item, value: item })),
        },
      ]}
    />
  )
}

export default SubnetSelector
