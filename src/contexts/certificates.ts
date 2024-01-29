import { createContext } from 'react'

import { Certificate } from '../__generated__/graphql'

export const CertificatesContext = createContext<Certificate[]>([])
