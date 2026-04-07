import { ethers } from 'ethers';
import provider from '../utils/blockchain.js';
import contractABI from '../abi/contract.json' assert { type: 'json' };

const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);

export default contract;