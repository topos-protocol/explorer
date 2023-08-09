import * as ToposCoreJSON from '@topos-protocol/topos-smart-contracts/artifacts/contracts/topos-core/ToposCore.sol/ToposCore.json'
import { ToposCore } from '@topos-protocol/topos-smart-contracts/typechain-types/contracts/topos-core'
import { ethers } from 'ethers'

export const toposCoreContract = new ethers.Contract(
  import.meta.env.VITE_TOPOS_CORE_CONTRACT_ADDRESS || '',
  ToposCoreJSON.abi
) as ToposCore
