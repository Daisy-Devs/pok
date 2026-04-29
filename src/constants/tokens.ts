export const TOKENS = {
  ETH: {
    address: undefined,
    wrappedAddress: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', // ✅ WETH Sepolia
    decimals: 18,
    symbol: 'ETH',
  },
  USDC: {
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as `0x${string}`, // ✅
    decimals: 6,
    symbol: 'USDC',
  },
  USDT: {
    address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0' as `0x${string}`, // ✅
    decimals: 6,
    symbol: 'USDT',
  },
  DAI: {
    address: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357' as `0x${string}`, // ✅ removed extra char
    decimals: 18,
    symbol: 'DAI',
  },
} as const

export type TokenSymbol = keyof typeof TOKENS

export const UNISWAP_ROUTER    = '0x3BFA4769FB09eEfC5A80d6e87C3B9C650F7Ae488' as `0x${string}`
export const UNISWAP_QUOTER_V2 = "0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3" as `0x${string}`