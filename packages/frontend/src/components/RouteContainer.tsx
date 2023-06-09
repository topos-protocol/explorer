import styled from '@emotion/styled'
import { Breadcrumb as AntdBreadcrumb } from 'antd'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import React from 'react'

const Breadcrumb = styled(AntdBreadcrumb)`
  margin: 1rem 0;
`

const Content = styled.div`
  min-height: 280px;
`

interface Props {
  breadcrumbItems: ItemType[]
  children: React.ReactNode
}

const RouteContainer = ({ breadcrumbItems, children }: Props) => (
  <>
    <Breadcrumb items={breadcrumbItems} />
    <Content>{children}</Content>
  </>
)

export default RouteContainer
