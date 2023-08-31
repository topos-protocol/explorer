import { providers } from 'ethers'
import { createContext } from 'react'

export const BlocksContext = createContext<providers.Block[]>([])
