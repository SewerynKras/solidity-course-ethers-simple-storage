import dotenv from "dotenv";
dotenv.config();

import { BigNumber, ethers } from "ethers";
import fs from "fs";

const providerUrl =
  process.env.NETWORK === "GOERLI"
    ? process.env.GOERLI_PROVIDER_URL
    : process.env.LOCAL_PROVIDER_URL;
const privateKey =
  process.env.NETWORK === "GOERLI"
    ? process.env.GOERLI_PRIVATE_KEY
    : process.env.LOCAL_PRIVATE_KEY;

if (!privateKey || !providerUrl) {
  throw new Error("Private key and/or provider url missing");
}

const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);

const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi");
const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin");

const simpleStorageFactory = new ethers.ContractFactory(
  abi.toString(),
  bin.toString(),
  wallet
);
const contract = await simpleStorageFactory.deploy();
console.log(`Deployed contract @ ${contract.address}`);
const storeTransaction = await contract.store(BigNumber.from("1337"));
await storeTransaction.wait();
const favNum = await contract.retrieve();
console.log({ raw: favNum, parsed: favNum.toString() });
