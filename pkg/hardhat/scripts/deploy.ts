import { viem } from "hardhat";

async function main() {

  const tokenFactory = await viem.deployContract("MyTokenFactory");
  const governorFactory = await viem.deployContract("MyGovernorFactory");
  const template = await viem.deployContract("BeamDaoTemplate", [tokenFactory.address, governorFactory.address]);

  await template.write.newDao(["QiDAO", "Qi Token","Qi", ["0xf632Ce27Ea72deA30d30C1A9700B6b3bCeAA05cF"],[100000000000n],[4n,500n,30000n,1000n,0n]]); //quorum, 1: delay, 2: period, 3: timelock, 4: votingThreshold

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
