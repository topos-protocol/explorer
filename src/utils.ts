export function shortenAddress(
  address: string,
  prefixSuffixLength: number = 10
) {
  return `${address.slice(0, prefixSuffixLength + 2)}...${address.slice(
    address.length - prefixSuffixLength
  )}`
}

export function sanitizeURLProtocol(protocol: 'ws' | 'http', endpoint: string) {
  return endpoint.indexOf('localhost') === -1 && !isIPAddressWithPort(endpoint)
    ? `${protocol}s://${endpoint}`
    : `${protocol}://${endpoint}`
}

export function removeURLProtocol(endpoint: string) {
  return endpoint.startsWith('http://') ||
    endpoint.startsWith('https://') ||
    endpoint.startsWith('ws://') ||
    endpoint.startsWith('wss://')
    ? new URL(endpoint).host
    : endpoint
}

function isIPAddressWithPort(input: string): boolean {
  // Regular expression to match an IP address with an optional port
  const ipWithPortRegex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/
  return ipWithPortRegex.test(input)
}
