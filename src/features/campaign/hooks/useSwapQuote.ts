import { quoterAbi } from "@/src/constants/contract";
import { TOKENS, TokenSymbol, UNISWAP_QUOTER_V2 } from "@/src/constants/tokens";
import { useEffect, useState } from "react";
import { decodeFunctionResult, encodeFunctionData } from "viem";
import { usePublicClient } from "wagmi";

export function useSwapQuote({
  userToken,
  campaignToken,
  donationAmount, // ← what user typed in, in their token
}: {
  userToken: TokenSymbol;
  campaignToken: TokenSymbol;
  donationAmount: bigint;
}) {
  const needsSwap = userToken !== campaignToken;

  const tokenIn =
    userToken === "ETH" ? TOKENS.ETH.wrappedAddress : TOKENS[userToken]?.address;

  const tokenOut =
    campaignToken === "ETH"
      ? TOKENS.ETH.wrappedAddress
      : TOKENS[campaignToken]?.address;
  console.log(tokenIn, tokenOut);

  const publicClient = usePublicClient();
  const [amountOut, setAmountOut] = useState<bigint | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!needsSwap || !tokenIn || !tokenOut || donationAmount === 0n){
      setAmountOut(undefined)  
       return;
      }

    let cancelled = false;
    setIsLoading(true);
    setError(undefined);

    const fetch = async () => {
      try {
        const calldata = encodeFunctionData({
          abi: quoterAbi,
          functionName: "quoteExactInputSingle",
          args: [
            {
              tokenIn,
              tokenOut,
              amountIn: donationAmount, // ✅ was: donationAmount (wrong key name)
              fee: 500, // ✅ was: BigInt(30000) — fee is uint24 number, not bigint; 30000 is wrong pool tier
              sqrtPriceLimitX96: 0n,
            },
          ],
        });

        const raw = await publicClient!.call({
          to: UNISWAP_QUOTER_V2,
          data: calldata,
        });

        const decoded = decodeFunctionResult({
          abi: quoterAbi,
          functionName: "quoteExactInputSingle",
          data: raw.data!,
        });

        if (!cancelled) setAmountOut((decoded)[0]);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [needsSwap, tokenIn, tokenOut, donationAmount, publicClient]);
console.log(amountOut,error);

  return { amountOut, isLoading, error,needsSwap };
}
