import { Block } from 'ethers'
import { createContext } from 'react'

export const BlocksContext = createContext<Block[]>([])
