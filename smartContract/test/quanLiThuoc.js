const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("quanLiThuoc contract", function () {
  it("Deploy thành công", async function () {
    const QuanLiThuoc = await ethers.getContractFactory("quanLiThuoc");
    const quanLiThuoc = await QuanLiThuoc.deploy();
    await quanLiThuoc.waitForDeployment();  // chờ contract deploy

    // kiểm tra địa chỉ hợp lệ
    expect(ethers.isAddress(quanLiThuoc.target)).to.be.true;
  });
});
