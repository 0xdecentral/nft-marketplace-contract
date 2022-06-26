// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ERC1155Collection = await ethers.getContractFactory(
    "ERC1155Collection"
  );
  const erc1155Collection = await ERC1155Collection.deploy("TempNFT", "TNFT");

  await erc1155Collection.deployed();

  console.log("Greeter deployed to:", erc1155Collection.address);

  const Markeplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await Markeplace.deploy(
    "5000",
    "0x83AD0b214cF800d4fF9fAd76683A3C869cabdC3C"
  );

  await nftMarketplace.deployed();

  console.log("Greeter deployed to:", nftMarketplace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
