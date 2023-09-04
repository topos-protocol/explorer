import { createContext, RefObject } from 'react'

export interface TourRefs {
  MenuRef?: RefObject<HTMLDivElement>
  NetworkSelectorRef?: RefObject<HTMLDivElement>
  NetworkSelectorToposSubnetRef?: RefObject<HTMLButtonElement>
  NetworkSelectorSubnetRef?: RefObject<HTMLButtonElement>
  NetworkSelectorTCERef?: RefObject<HTMLButtonElement>
}

export const TourRefsContext = createContext<TourRefs>({})
