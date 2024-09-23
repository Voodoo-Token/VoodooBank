const hre = require("hardhat");





// Voodoo deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Safe deployed to 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

async function main() {
  // Deploy Voodoo Token
  // const Voodoo = await hre.ethers.getContractFactory("Voodoo");
  // const voodoo = await Voodoo.deploy();
  // await voodoo.deployed();
  // console.log(`Voodoo deployed to ${voodoo.target}`);


  // MUMBAI TEST ADDRESS VOODOO  =  0x5ABB9c83E367B5B103c0c37e99ABDa518B34BdAE

  // Deploy Safe Contract with the target of the deployed Voodoo Token
  const Safe = await hre.ethers.getContractFactory("Safe");
  const safe = await Safe.deploy("0x5ABB9c83E367B5B103c0c37e99ABDa518B34BdAE");
  // const safe = await Safe.deploy(voodoo.target);

  // await safe.deployed();
  console.log(`Safe deployed to ${safe.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
