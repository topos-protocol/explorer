export function shortenAddress(
  address: string,
  prefixSuffixLength: number = 7
) {
  return `${address.slice(0, prefixSuffixLength)}...${address.slice(
    address.length - prefixSuffixLength
  )}`
}
