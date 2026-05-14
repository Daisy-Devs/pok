import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TokenSymbol } from "../constants/tokens";

/**
 * A utility function to merge multiple class names into a single class
 * name string.
 *
 * @param {...inputs} - A variable number of class names to merge.
 * @returns {string} - The merged class name string.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Splits a title into two halves, with the first half being the first
 * half of the words in the title, and the second half being the
 * second half of the words in the title.
 * @param {string} title - The title to be split.
 * @returns {Object} An object containing the first and second halves of the title.
 */
export function splitTitle(title: string) {
  const words = title?.split(" ");
  const index = Math.floor(words?.length/2);
  const firstHalf = words?.slice(0, index)?.join(" ");
  const secondHalf = words?.slice(index)?.join(" ");
  return { firstHalf, secondHalf };
}

/**
 * Returns a string representing the time that has passed since the given date.
 *
 * @param {string} dateInput - The date to be used in the calculation.
 * @returns {string} A string representing the time that has passed since the given date.
 */
/* eslint-disable max-len */
export function timeAgo(dateInput:string) {
     const date = new Date(dateInput).getTime(); 
    const now = new Date().getTime(); 
    
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);
    const months  = Math.floor(days / 30);
    const years   = Math.floor(days / 365);

    if (seconds < 60)  return `${seconds} seconds ago`;
    if (minutes < 60)  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24)    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 30)     return `${days} day${days > 1 ? 's' : ''} ago`;
    if (months < 12)   return `${months} month${months > 1 ? 's' : ''} ago`;
                       return `${years} year${years > 1 ? 's' : ''} ago`;
}

export function hideWalletAddress(address: `0x${string}` | undefined) {
  return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
}


const DISPLAY_DECIMALS: Record<TokenSymbol, number> = {
  ETH:  6,
  DAI:  4,
  USDC: 4,
  USDT: 4,
};

export function formatCryptoAmount(amount: number, currency: TokenSymbol): string {
  if (amount == null || !isFinite(amount) || isNaN(amount)) return "0.00";

  const decimals = DISPLAY_DECIMALS[currency] ?? 2;

  // Floor instead of round to never overstate balance
  const factor = Math.pow(10, decimals);
  const floored = Math.floor(amount * factor) / factor;

  return parseFloat(floored.toFixed(decimals)).toString();
}