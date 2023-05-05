import axios from 'axios'
import React, { useEffect } from 'react'

import { ErrorsContext } from '../contexts/errors'
import { SubnetWithId } from '../types'

export default function useSubnetCertInfo(subnet?: SubnetWithId) {
  const { setErrors } = React.useContext(ErrorsContext)
  const [latestCertificate, setLatestCertificate] = React.useState<any>()

  useEffect(function init() {
    console.log('called')
    const subnetId = subnet?.id.startsWith('0x')
      ? subnet.id.substring(2)
      : subnet?.id

    axios
      .get(`api/grpc/latest/${subnetId}`)
      .then(({ data }) => {
        setLatestCertificate(data)
      })
      .catch((error) => {
        console.error(error)
        setErrors((e) => [...e, error])
      })
  }, [])

  return { latestCertificate }
}
