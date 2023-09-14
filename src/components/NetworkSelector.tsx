import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Divider, Form, Input, Select, Space, Button } from 'antd'
import React, { useState, useCallback, useEffect, ReactNode } from 'react'
import { removeURLProtocol } from '../utils'

interface Props {
  allowCustomItems: boolean
  customItemsLabel?: string
  defaultCustomItems?: { label: string; value: string | number }[]
  fixedItems?: { label: ReactNode; value: string | number }[]
  fixedItemsLabel: string
  initialValue?: string
  localStorageKeyCustomItems?: string
  loading?: boolean
  onValueChange: (value: string) => void
  selectPlaceholder: string
  title: string
}

const NetworkSelector = ({
  allowCustomItems,
  customItemsLabel,
  defaultCustomItems,
  fixedItems,
  fixedItemsLabel,
  initialValue,
  localStorageKeyCustomItems,
  loading,
  onValueChange,
  selectPlaceholder,
  title,
}: Props) => {
  const [customItems, setCustomItems] = useState<string[]>([])
  const [newCustomItem, setNewCustomItem] = useState('')
  const [form] = Form.useForm()

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewCustomItem(event.target.value)
    },
    []
  )

  const addItem = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      e.preventDefault()
      setCustomItems((items) => [...items, removeURLProtocol(newCustomItem)])
      setNewCustomItem('')
    },
    [newCustomItem]
  )

  const removeLastItem = useCallback(() => {
    setCustomItems((items) => items.slice(0, items.length - 1))
  }, [])

  useEffect(
    function loadItemsFromLocalStorage() {
      if (localStorageKeyCustomItems) {
        const storedItems = localStorage.getItem(localStorageKeyCustomItems)
        setCustomItems(
          storedItems
            ? JSON.parse(storedItems)
            : defaultCustomItems?.map((i) => i.value)
        )
      }
    },
    [localStorageKeyCustomItems]
  )

  useEffect(
    function saveItemsToLocalStorage() {
      if (localStorageKeyCustomItems) {
        localStorage.setItem(
          localStorageKeyCustomItems,
          JSON.stringify(customItems)
        )
      }
    },
    [customItems, localStorageKeyCustomItems]
  )

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="selector" label={title} initialValue={initialValue}>
        <Select
          style={{ width: 400 }}
          disabled={loading}
          loading={loading}
          placeholder={selectPlaceholder}
          onChange={onValueChange}
          dropdownRender={(menu) => (
            <>
              {menu}
              {allowCustomItems && (
                <>
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder="Add custom value"
                      value={newCustomItem}
                      onChange={onNameChange}
                      style={{ width: 260 }}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addItem}
                    >
                      Add item
                    </Button>
                  </Space>
                  <Space style={{ float: 'right', padding: '0 8px 4px' }}>
                    <Button
                      type="text"
                      danger
                      disabled={!customItems.length}
                      icon={<DeleteOutlined />}
                      onClick={removeLastItem}
                    >
                      Remove last
                    </Button>
                  </Space>
                </>
              )}
            </>
          )}
          options={[
            ...[
              {
                label: fixedItemsLabel,
                options: fixedItems,
              },
            ],
            ...(allowCustomItems
              ? [
                  {
                    label: customItemsLabel,
                    options: customItems?.map((item) => ({
                      label: item,
                      value: item,
                    })),
                  },
                ]
              : []),
          ]}
        />
      </Form.Item>
    </Form>
  )
}

export default NetworkSelector
