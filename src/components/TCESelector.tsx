import { PlusOutlined } from '@ant-design/icons'
import { Divider, Form, Input, Select, Space, Button, Typography } from 'antd'
import type { InputRef } from 'antd'
import { ethers, BigNumber } from 'ethers'
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react'

import { SelectedNetworksContext } from '../contexts/selectedNetworks'

const { Text } = Typography

let index = 0

const TCESelector = () => {
  const { selectedTCEEndpoint, setSelectedTCEEndpoint } = useContext(
    SelectedNetworksContext
  )
  const [mainnetItems] = useState(['tce.devnet-1.topos.technology'])
  const [items, setItems] = useState(['http://localhost:4000'])
  const [name, setName] = useState('')
  const inputRef = useRef<InputRef>(null)
  const [form] = Form.useForm()

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
    async (endpoint: string) => {
      if (endpoint && setSelectedTCEEndpoint) {
        const storedTCEEndpoint = localStorage.getItem('tceEndpoint')
        if (storedTCEEndpoint !== endpoint) {
          localStorage.setItem('tceEndpoint', endpoint)
        }

        setSelectedTCEEndpoint(endpoint)
      }
    },
    [setSelectedTCEEndpoint]
  )

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={{ tceEndpoint: selectedTCEEndpoint }}
    >
      <Form.Item name="tceEndpoint" label="TCE endpoint">
        <Select
          style={{ width: 300 }}
          placeholder="Select a TCE endpoint"
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
              label: 'Mainnet',
              options: mainnetItems
                ? mainnetItems.map((item) => ({
                    label: (
                      <Space>
                        <Text>{item}</Text>
                      </Space>
                    ),
                    value: item,
                  }))
                : [],
            },
            {
              label: 'Custom',
              options: items?.map((item) => ({ label: item, value: item })),
            },
          ]}
        />
      </Form.Item>
    </Form>
  )
}

export default TCESelector
