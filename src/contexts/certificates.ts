import { createContext } from 'react'

import { Certificate } from '../types'

export const CertificatesContext = createContext<Certificate[]>([])
