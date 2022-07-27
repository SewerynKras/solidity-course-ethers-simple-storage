import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import fs from "fs";

if (!process.env.PRIVATE_KEY) {
  throw new Error("No private key in env");
}

const provider = new ethers.providers.JsonRpcProvider("http://0.0.0.0:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi");
const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin");

const simpleStorageFactory = new ethers.ContractFactory(
  abi.toString(),
  bin.toString(),
  wallet
);
const contract = await simpleStorageFactory.deploy({});
console.log(contract);
