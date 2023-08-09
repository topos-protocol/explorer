import { Avatar, Space, Typography } from 'antd'

import { SubnetWithId } from '../types'

const { Text } = Typography

interface Props {
  subnet?: SubnetWithId
}

const SubnetNameAndLogo = ({ subnet }: Props) => {
  return (
    <Space>
      <Avatar size="small" src={subnet?.logoURL} />
      <Text>{subnet?.name}</Text>
    </Space>
  )
}

export default SubnetNameAndLogo
