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

import { SelectedToposSubnetContext } from '../contexts/selectedToposSubnet'
import { toposCoreContract } from '../contracts'

const { Text } = Typography

let index = 0

const ToposSubnetSelector = () => {
  const { selectedToposSubnet, setSelectedToposSubnet } = useContext(
    SelectedToposSubnetContext
  )
  const [mainnetItems] = useState(['rpc.topos-subnet.zkfoundation.io'])
  const [items, setItems] = useState(['localhost:10002'])
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
      if (endpoint && setSelectedToposSubnet) {
        const storedToposSubnetEndpoint = localStorage.getItem(
          'toposSubnetEndpoint'
        )
        if (storedToposSubnetEndpoint !== endpoint) {
          localStorage.setItem('toposSubnetEndpoint', endpoint)
        }

        const provider = new ethers.providers.JsonRpcProvider(
          `http://${endpoint}`
        )
        const network = await provider.getNetwork()
        const chainId = network.chainId

        const contract = toposCoreContract.connect(provider)
        const subnetId = await contract.networkSubnetId()

        setSelectedToposSubnet({
          chainId: BigNumber.from(chainId.toString()),
          currencySymbol: 'TOPOS',
          endpoint,
          id: subnetId,
          logoURL: '/logo.svg',
          name: 'Topos Subnet',
        })
      }
    },
    [setSelectedToposSubnet]
  )

  useEffect(function loadStoredValueOnInit() {
    const storedToposSubnetEndpoint = localStorage.getItem(
      'toposSubnetEndpoint'
    )

    if (storedToposSubnetEndpoint) {
      form.setFieldValue('toposSubnetEndpoint', storedToposSubnetEndpoint)
      onValueChange(storedToposSubnetEndpoint)
    }
  }, [])

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="toposSubnetEndpoint" label="Topos Subnet endpoint">
        <Select
          style={{ width: 300 }}
          placeholder="Select a Topos Subnet endpoint"
          onChange={onValueChange}
          defaultValue={selectedToposSubnet?.endpoint}
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

export default ToposSubnetSelector
