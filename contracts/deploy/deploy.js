const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const { Wallet } = require("zksync-ethers");

module.exports = async function (hre) {
  try {
    const pk = process.env.PRIVATE_KEY;
    if (!pk) throw new Error("PRIVATE_KEY not set");
    const wallet = new Wallet(pk);

    const deployer = new Deployer(hre, wallet);
    const artifact = await deployer.loadArtifact("OnchainCard");

    const contract = await deployer.deploy(artifact, []);
    const addr = (contract.getAddress) ? await contract.getAddress() : contract.address;

    const tx = contract.deploymentTransaction ? contract.deploymentTransaction() : undefined;
    const txHash = tx?.hash;

    console.log("OnchainCard deployed to:", addr);
    if (txHash) console.log("Deployment tx hash:", txHash);
  } catch (e) {
    console.error("Deploy failed:", e);
    process.exit(1);
  }
};
