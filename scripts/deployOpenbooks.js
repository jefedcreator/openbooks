// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
  /*
A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
so nftContract here is a factory for instances of our GameItem contract.
*/
  const openbooksContract = await ethers.getContractFactory("openBooks");

  // here we deploy the contract
  const deployedOpenbooksContract = await openbooksContract.deploy();

  // wait for the contract to deploy
  await deployedOpenbooksContract.deployed();

  // print the address of the deployed contract
  console.log("NFT Contract Address:", deployedOpenbooksContract.address);
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });