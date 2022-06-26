import { expect } from "chai";
import { ethers } from "hardhat";

function toWei(value: number) {
  return ethers.utils.parseEther(value.toString());
}

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const [owner, creator, feeRecipient, addr2] = await ethers.getSigners();

    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    const nftMarketplace = await NFTMarketplace.deploy(
      5000,
      feeRecipient.address
    );
    await nftMarketplace.deployed();

    const NFT = await ethers.getContractFactory("ERC1155Collection");
    const nft = await NFT.deploy("hello", "HELLO");

    await nft.deployed();

    await nft.connect(creator).mint("tokenCID1", 2, "0x00");

    expect(await nft.balanceOf(creator.address, 1)).to.equal(2);

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy("Temp Token", "TT");
    await token.deployed();

    await nft.connect(creator).setApprovalForAll(nftMarketplace.address, true);

    await nftMarketplace.addPayableToken(token.address);

    const buyPrice = 10000;

    await nftMarketplace
      .connect(creator)
      .listNFT(nft.address, 1, token.address, toWei(buyPrice));

    expect(await nft.balanceOf(creator.address, 1)).to.equal(1);

    expect(await nft.balanceOf(nftMarketplace.address, 1)).to.equal(1);

    await token.connect(owner).approve(nftMarketplace.address, toWei(buyPrice));

    await nftMarketplace
      .connect(owner)
      .buyNFT(nft.address, 1, token.address, toWei(buyPrice));

    expect(await nft.balanceOf(owner.address, 1)).to.equal(1);
    expect((await token.balanceOf(creator.address)).toString()).to.equal(
      buyPrice
    );

    // expect(await nft.balanceOf(nftMarketplace.address, 0)).to.equal(1);
  });
});
