import { Tag } from 'antd'

interface Props {
  status?: number
}

const TransactionStatus = ({ status }: Props) => (
  <>
    {status ? <Tag color="cyan">Success</Tag> : <Tag color="error">Failed</Tag>}
  </>
)

export default TransactionStatus
