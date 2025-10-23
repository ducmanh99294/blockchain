const hre = require("hardhat");

async function main() {
  const QuanLiThuoc = await hre.ethers.getContractFactory("QuanLyThuoc");
  const quanLiThuoc = await QuanLiThuoc.deploy();

  // Đợi transaction confirm
  await quanLiThuoc.waitForDeployment();

  console.log(`quanLiThuoc deployed to: ${await quanLiThuoc.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
