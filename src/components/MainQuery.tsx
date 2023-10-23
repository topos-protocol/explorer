import styled from '@emotion/styled'
import { AutoComplete, Form, Input } from 'antd'
import { useContext, useMemo } from 'react'

import _Link from './Link'
import useSubnetGetBlock from '../hooks/useSubnetGetBlock'
import { SelectedNetworksContext } from '../contexts/selectedNetworks'
import useSubnetGetTransactionAndReceipt from '../hooks/useSubnetGetTransactionAndReceipt'
import useSubnetGetCertificateById from '../hooks/useSubnetGetCertificateById'
import useSubnetGetCertificates from '../hooks/useSubnetGetCertificates'
import useSubnetGetAccountBalance from '../hooks/useSubnetGetAccountBalance'
import { SearchOutlined } from '@ant-design/icons'

const Link = styled(_Link)`
  color: ${({ theme }) => theme.colorText};

  &:hover {
    color: ${({ theme }) => theme.colorText} !important;
  }
`

const MainQuery = () => {
  const [form] = Form.useForm()
  const query: string = Form.useWatch('query', form)
  const sanitizedQuery = useMemo(() => query?.trim(), [query])
  const { selectedSubnet } = useContext(SelectedNetworksContext)
  const { block } = useSubnetGetBlock(selectedSubnet, sanitizedQuery)
  const { transaction } = useSubnetGetTransactionAndReceipt(
    selectedSubnet,
    sanitizedQuery
  )
  const { certificate } = useSubnetGetCertificateById({
    certificateId: sanitizedQuery,
    sourceSubnetId: selectedSubnet?.id,
  })
  const { certificates: certificatesByPosition } = useSubnetGetCertificates({
    limit: 1,
    sourceStreamPosition: {
      position: isNaN(+sanitizedQuery) ? Infinity : parseInt(sanitizedQuery),
      sourceSubnetId: { value: selectedSubnet?.id || '' },
    },
  })
  const { balance } = useSubnetGetAccountBalance(selectedSubnet, sanitizedQuery)

  const options = useMemo(() => {
    const options = []

    if (block) {
      options.push({
        label: (
          <span>
            Blocks
            <_Link
              style={{ float: 'right' }}
              to={`/subnet/${selectedSubnet?.id}/blocks`}
            >
              more
            </_Link>
          </span>
        ),
        options: [
          {
            label: (
              <Link to={`/subnet/${selectedSubnet?.id}/block/${block.hash}`}>
                {block.hash}
              </Link>
            ),
            value: block.hash,
          },
        ],
      })
    }

    if (transaction) {
      options.push({
        label: <span>Transactions</span>,
        options: [
          {
            label: (
              <Link
                to={`/subnet/${selectedSubnet?.id}/transaction/${transaction.hash}`}
              >
                {transaction.hash}
              </Link>
            ),
            value: transaction.hash,
          },
        ],
      })
    }

    if (
      certificate ||
      (certificatesByPosition && certificatesByPosition?.length)
    ) {
      options.push({
        label: (
          <span>
            Certificates
            <_Link
              style={{ float: 'right' }}
              to={`/subnet/${selectedSubnet?.id}/certificates`}
            >
              more
            </_Link>
          </span>
        ),
        options: [
          {
            label: (
              <Link
                to={`/subnet/${selectedSubnet?.id}/certificate/${
                  certificate ? certificate.id : certificatesByPosition![0].id
                }`}
              >
                {certificate ? certificate.id : certificatesByPosition![0].id}
              </Link>
            ),
            value: certificate ? certificate.id : certificatesByPosition![0].id,
          },
        ],
      })
    }

    if (balance) {
      options.push({
        label: <span>Accounts</span>,
        options: [
          {
            label: (
              <Link
                to={`/subnet/${selectedSubnet?.id}/account/${sanitizedQuery}`}
              >
                {sanitizedQuery}
              </Link>
            ),
            value: sanitizedQuery,
          },
        ],
      })
    }

    return options
  }, [block, transaction, certificate, certificatesByPosition, balance])

  return (
    <Form form={form}>
      <Form.Item name="query">
        <AutoComplete
          options={options}
          popupMatchSelectWidth={700}
          style={{ maxWidth: 700 }}
        >
          <Input
            addonBefore={<SearchOutlined />}
            allowClear
            placeholder="Query by tx, block, certificate, or account"
            size="large"
          />
        </AutoComplete>
      </Form.Item>
    </Form>
  )
}

export default MainQuery
