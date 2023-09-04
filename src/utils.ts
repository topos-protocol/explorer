export function shortenAddress(
  address: string,
  prefixSuffixLength: number = 10
) {
  return `${address.slice(0, prefixSuffixLength + 2)}...${address.slice(
    address.length - prefixSuffixLength
  )}`
}

export function sanitizeURLProtocol(protocol: 'ws' | 'http', endpoint: string) {
  return location.protocol.startsWith('https') &&
    endpoint.indexOf('localhost') === -1 &&
    !isStringIpAddress(endpoint)
    ? `${protocol}s://${endpoint}`
    : `${protocol}://${endpoint}`
}

function isStringIpAddress(value: string) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      value
    )
  ) {
    return true
  }
  return false
}
