import { Dispatch, SetStateAction, createContext } from 'react'

export type RouteParamsProcessing = {
  isReady: boolean
  subnetId?: string
}

export const RouteParamsFirstContext = createContext<{
  routeParamsProcessing?: RouteParamsProcessing
  setRouteParamsProcessing?: Dispatch<
    SetStateAction<RouteParamsProcessing | undefined>
  >
}>({})
