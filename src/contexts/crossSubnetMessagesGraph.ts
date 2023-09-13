import { createContext } from 'react'

export const CrossSubnetMessagesGraphContext = createContext<{
  subnetsLatestBlockNumbers?: Map<string, number>
}>({})
