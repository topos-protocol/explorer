export function shortenAddress(
  address: string,
  prefixSuffixLength: number = 10
) {
  return `${address.slice(0, prefixSuffixLength + 2)}...${address.slice(
    address.length - prefixSuffixLength
  )}`
}
